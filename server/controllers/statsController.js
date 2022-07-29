import {
    GameStates
} from "../model/gameLogic.js";

import {UserModel} from "../model/UserModel.js";
import {MatchModel} from "../model/MatchModel.js";
import {PendingRequestModel} from "../model/PendingRequestModel.js";

async function findUserId(username) {
    const account = await UserModel.findOne({'username':username}, '_id')
    if(!account) return;
    else return account._id.toString();
}

const getActiveMatchesOfUser = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({
             status: {state: GameStates.PLAYING, player : requesterId }
    }, "_id");
    res.status(200).json({
        matches: matches
    });
}

const getAllMatchesOfUser = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({players: { "$in" : [requesterId]}}, ["_id", "status", "players"]) ;
    for(let match of matches) {
        let players_names = [];
        for(let id in match.players) {
            const name = await UserModel.findById(match.players[id], ['username']);
            if(match.status.player == match.players[id]) match.status.player = name.username;
            players_names.push(name.username);
        }
        match.players = players_names;
    }
    const pending = await PendingRequestModel.findOne({"playerId": requesterId});
    res.status(200).json({
        pending: (pending != null),
        matches: matches
    });
}

const getOngoingMatches = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({players: requesterId,
         status: {state:GameStates.PLAYING }}, "_id")
    res.status(200).json({
        matches: matches
    });
}

const getUserStats = async (req, res) => {
    const requesterId = await findUserId(req.username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches_won = await MatchModel.find({
        status: {state : GameStates.WINNER, player : requesterId}
    }).count();
    const matches_lost = await MatchModel.find({
        status: {state : GameStates.WINNER, player : {$ne:requesterId}}
    }).count();
    const matches_draw = await MatchModel.find({ players: requesterId, status: GameStates.DRAW}).count();
    res.status(200).json({
        matches_won: matches_won,
        matches_lost: matches_lost,
        matches_draw: matches_draw
    });
}


export const statsController = {
    getActiveMatchesOfUser,
    getOngoingMatches,
    getAllMatchesOfUser,
    getUserStats,
};