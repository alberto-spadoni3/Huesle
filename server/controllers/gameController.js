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
    const {username} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });

    let pendingRequest;
    if(req.body.hasOwnProperty('secretCode')) {
        pendingRequest = await PendingRequestModel.where({'secretCode': req.body.secretCode}).findOne();
    } else {
        pendingRequest = await PendingRequestModel.where({ "secretCode": null}).findOne();
    }

    if(pendingRequest) {
        if(pendingRequest.playerId == requesterId) {
            return res.status(400).json({
                message: "User already pending for match with those specifics"
            });
        }
        pendingRequest.deleteOne();
        const newMatch = await createMatch(requesterId, pendingRequest.playerId, true);
        emitNewMatch(newMatch.players, newMatch._id);
        return res.status(200).json({
            matchId: newMatch._id
        });
    } else {
        let pendingRequestToSave = {
            playerId: requesterId
        }
        if(req.body.hasOwnProperty('secretCode')) {
            pendingRequestToSave.secretCode = req.body.secretCode;
        }

        const newPendingRequest = new PendingRequestModel(pendingRequestToSave);
        await newPendingRequest.save();
        return res.status(200).json({
            message: "Searching other contestant"
        });
    }
}

function createMatch(p1, p2, repetitions) {
    const matchDoc = {
        players: [p1, p2],
        status: GameStates.TURN_P1,
        turn: 0,
        date: mongoose.now()
    }

    if(repetitions) {
        matchDoc.solution = createRandomSolutionWithRepetition();
    } else {
        matchDoc.solution = createSolutionWithoutRepetition();
    }

    const newMatch = new MatchModel(matchDoc);
    return newMatch.save();
}

const doGuess = async (req, res) => {
    const {username, matchId, sequence} = req.body;
    const userId = await findUserId(username);
    if(!userId) return res.status(400).json({
        message: "Username not valid"
    });

    const match = await MatchModel.findById(matchId).findOne({players: `${userId}`});
    if(!match) {
        return res.status(400).json({
            message: "Invalid match selected"
        });
    } else if(isMatchOver(match.status)) {
        return res.status(400).json({
            message: "This match is already over"
        });
    } else if(isPlayerTurn(match.players.indexOf(userId), match.status)) {
        return res.status(400).json({
            message: "It's not " + username + " turn!"
        });
    }
    const {status, turn, rightC, rightP} = elaborateTurn(sequence, match.solution, match.status, match.turn);

    const guessDoc = {
        playerId: userId,
        sequence: sequence,
        rightPositions: rightC,
        rightColours: rightP
    }

    match.attempts.push(guessDoc);
    match.turn = turn;
    match.status = status;
    match.save();

    if(isMatchOver(status)) {
        emitMatchOver(matchId, status);
    } else if (status == GameStates.TURN_P1) {
        emitNewMove(match.players[0], matchId)
    } else {
        emitNewMove(match.players[1], matchId)
    }

    res.status(200).json({
        rightC: rightC,
        rightP: rightP,
        status: status
    });
}

const leaveMatch = async (req, res) => {
    const {username, matchId} = req.body;
    const userId = await findUserId(username, res);
    if(!userId) return res.status(400).json({
        message: "Username not valid"
    });

    const match = await MatchModel.findById(matchId).findOne({players: `${userId}`});
    if(!match) {
        return res.status(400).json({
            message: "Invalid match selected"
        });
    }
    if(!isMatchOver(match.status)) {
        const playerIndex = match.players.indexOf(userId);
        match.status = playerIndex == 1? GameStates.WIN_P2: GameStates.WIN_P1;
        match.save();
        emitMatchOver(matchId, match.status);
        return res.status(200).json({
            message: "Conceded victory to adversary from " + username
        });
    } else {
        return res.status(400).json({
            message: "The match is already over!"
        });
    }
}

const getMatch = async (req, res) => {
    const {matchId} = req.body;
    const match = await MatchModel.findById(matchId);
    res.status(200).json({
        match: match
    });
}

const getActiveMatchesOfUser = async (req, res) => {
    const {username} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({$or: [
            { "players.0": requesterId , status: GameStates.TURN_P1 },
            { "players.1": requesterId , status: GameStates.TURN_P2 }
    ]}, "_id");
    res.status(200).json({
        matches: matches
    });
}

const getAllMatchesOfUser = async (req, res) => {
    const {username} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({player: requesterId}, "_id")
    res.status(200).json({
        matches: matches
    });
}

const getOngoingMatches = async (req, res) => {
    const {username} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({player: requesterId,
        $or: [{ status: GameStates.TURN_P1 }, { status: GameStates.TURN_P2 }]}, "_id")
    res.status(200).json({
        matches: matches
    });
}

const getUserStats = async (req, res) => {
    const {username} = req.body;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches_won = await MatchModel.find({$or: [
            { "players.0": requesterId , status: GameStates.WIN_P1 },
            { "players.1": requesterId , status: GameStates.WIN_P2 }
        ]
    }).count();
    const matches_lost = await MatchModel.find({$or: [
            { "players.0": requesterId, status: GameStates.WIN_P2 },
            { "players.1": requesterId, status: GameStates.WIN_P1 }
        ]
    }).count();
    const matches_draw = await MatchModel.find({ players: requesterId, status: GameStates.Draw}).count();
    res.status(200).json({
        matches_won: matches_won,
        matches_lost: matches_lost,
        matches_draw: matches_draw
    });
}


export const gameController = {
    searchMatch,
    doGuess,
    leaveMatch,
    getActiveMatchesOfUser,
    getOngoingMatches,
    getAllMatchesOfUser,
    getUserStats,
    getMatch
};