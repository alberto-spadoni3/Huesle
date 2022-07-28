import {
    createRandomSolutionWithRepetition,
    createSolutionWithoutRepetition,
    elaborateTurn,
    GameStates, isMatchOver, isPlayerTurn
} from "../model/gameLogic.js";

import mongoose from "mongoose";

import {PendingRequestModel} from "../model/PendingRequestModel.js";
import {UserModel} from "../model/UserModel.js";
import {MatchModel} from "../model/MatchModel.js";
import {emitNewMatch, emitNewMove, emitMatchOver} from "../middlewares/socketHandler.js"

async function findUserId(username) {
    const account = await UserModel.findOne({'username':username}, '_id')
    if(!account) return;
    else return account._id.toString();
}

const searchMatch = async (req, res) => {
    const {username, secret} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });

    let pendingRequest;
    if(secret) {
        pendingRequest = await PendingRequestModel
            .where("playerId").equals(requesterId)
            .where("secretCode").ne(null).findOne();
    } else {
        pendingRequest = await PendingRequestModel
            .where("playerId").equals(requesterId)
            .where("secretCode").equals(null).findOne();
    }
    console.log(pendingRequest);
    if(pendingRequest) {
        return res.status(400).json({
            message: "User already pending for match with those specifics"
        });
    }

    if(!secret) {
        //Finding public match
        const pendingRequest = await PendingRequestModel
            .where("secretCode").equals(null)
            .where("playerId").ne(requesterId).findOne();
        if (pendingRequest) {
            pendingRequest.deleteOne();
            const newMatch = await createMatch(requesterId, pendingRequest.playerId, true);
            return res.status(200).json({
                matchId: newMatch._id
            });
        }
    }

    //Create new request
    let pendingRequestToSave = {
        playerId: requesterId
    }
    if (secret) {
        pendingRequestToSave.secretCode = await generateSecretCode();
    }
    const newPendingRequest = new PendingRequestModel(pendingRequestToSave);
    await newPendingRequest.save();
    return res.status(200).json({
        message: "Searching other contestant",
        secretCode: pendingRequestToSave.secretCode
    });
}

const joinPrivateMatch = async (req, res) => {
    const {username, secretCode} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });

    let pendingRequest = await PendingRequestModel
        .where("playerId").ne(requesterId)
        .where("secretCode").equals(secretCode)
        .findOne();

    if(pendingRequest) {
        pendingRequest.deleteOne();
        const newMatch = await createMatch(requesterId, pendingRequest.playerId, true);
        return res.status(200).json({
            matchId: newMatch._id
        });
    } else {
        return res.status(404).json({
            message: "No match found with that secret code"
        });
    }
}

const leaveSearchPrivateMatch = async (req, res) => {
    const {username} = req.body;

    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
            error: "Username not valid"
        });

    const pendingRequest = await PendingRequestModel
        .where("playerId").equals(requesterId)
        //.where("secretCode").ne(null)
        .findOne();

    if(pendingRequest) {
        pendingRequest.deleteOne();
        return res.status(200).json({
            message: "Search abandoned successfully"
        });
    } else {
        return res.status(400).json({
            error: "No pending request found"
        });
    }
}

function createMatch(p1, p2, repetitions) {
    const matchDoc = {
        players: [p1, p2],
        status: {
            state: GameStates.PLAYING,
            turn: 0,
            player: p1
        },
        date: mongoose.now()
    }

    if(repetitions) {
        matchDoc.solution = createRandomSolutionWithRepetition();
    } else {
        matchDoc.solution = createSolutionWithoutRepetition();
    }

    const newMatch = new MatchModel(matchDoc);
    emitNewMatch(newMatch.players, newMatch._id);
    return newMatch.save();
}

async function generateSecretCode() {
    let duplicateCode, secretCode;
    do {
        secretCode = Math.floor(Math.random() * 99999);
        duplicateCode = await PendingRequestModel.where("secretCode").equals(secretCode).findOne();
    } while (duplicateCode);
    while(secretCode.toString().length < 5) secretCode = "0" + secretCode;
    return secretCode;
}

export const searchController = {
    searchMatch,
    joinPrivateMatch,
    leaveSearchPrivateMatch,
};