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
    const {username} = req.query;
    const requesterId = await findUserId(username);
    if(!requesterId) return res.status(400).json({
        message: "Username not valid"
    });
    const matches = await MatchModel.find({players: { "$in" : [requesterId]}}, ["_id", "status", "players"]) ;
    for(let match of matches) {
        let players_names = [];
        for(let id in match.players) {
            const name = await UserModel.findById(match.players[id], ['username']);
            players_names.push(name.username);
        }
        match.players = players_names;
    }
    const pending = await PendingRequestModel.findOne({"playerId": requesterId});
    res.status(200).json({
        pending: (pending.length != 0),
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


export const statsController = {
    getActiveMatchesOfUser,
    getOngoingMatches,
    getAllMatchesOfUser,
    getUserStats,
};