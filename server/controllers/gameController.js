import {
    changePlayer,
    elaborateTurn,
    GameStates,
    isMatchOver,
    isPlayerTurn,
} from "../model/gameLogic.js";

import { UserModel } from "../model/UserModel.js";
import { MatchModel } from "../model/MatchModel.js";
import { emitNewMove, emitMatchOver } from "../middlewares/socketHandler.js";

async function findUserId(username) {
    const account = await UserModel.findOne({ username: username }, "_id");
    if (!account) return;
    else return account._id.toString();
}

const doGuess = async (req, res) => {
    const { username, matchId, sequence } = req.body;
    const userId = await findUserId(username);
    if (!userId)
        return res.status(400).json({
            message: "Username not valid",
        });

    const match = await MatchModel.findById(matchId).findOne({
        players: `${userId}`,
    });
    if (!match) {
        return res.status(400).json({
            message: "Invalid match selected",
        });
    } else if (isMatchOver(match.status)) {
        return res.status(400).json({
            message: "This match is already over",
        });
    } else if (isPlayerTurn(match.players.indexOf(userId), match.status)) {
        return res.status(400).json({
            message: "It's not " + username + " turn!",
        });
    }
    const { status, rightC, rightP } = elaborateTurn(
        sequence,
        match.solution,
        match.status,
        match.players
    );
    const guessDoc = {
        playerId: userId,
        sequence: sequence,
        rightPositions: rightP,
        rightColours: rightC,
    };

    match.attempts.push(guessDoc);
    match.status = status;
    match.save();

    if (isMatchOver(status)) {
        emitMatchOver(matchId, status);
    } else {
        emitNewMove(match.status.player, matchId);
    }

    res.status(200).json({
        rightC: rightC,
        rightP: rightP,
        status: status,
    });
};

const leaveMatch = async (req, res) => {
    const { username, matchId } = req.body;
    const userId = await findUserId(username, res);
    if (!userId)
        return res.status(400).json({
            message: "Username not valid",
        });

    const match = await MatchModel.findById(matchId).findOne({
        players: `${userId}`,
    });
    if (!match) {
        return res.status(400).json({
            message: "Invalid match selected",
        });
    }
    if (!isMatchOver(match.status)) {
        match.status.state = GameStates.WINNER;
        match.status.player = changePlayer(match.players, match.status.players);
        match.save();
        emitMatchOver(matchId, match.status);
        return res.status(200).json({
            message: "Conceded victory to adversary from " + username,
        });
    } else {
        return res.status(400).json({
            message: "The match is already over!",
        });
    }
};

const getMatch = async (req, res) => {
    const { matchId } = req.query;
    const match = await MatchModel.findById(matchId, [
        "players",
        "turn",
        "status",
        "attempts",
    ]);

    if (!match)
        return res
            .status(400)
            .json({ message: "Match not found for the given ID" });

    let players = [];
    let players_names = [];
    for (let index in match.players) {
        const name = await UserModel.findById(match.players[index], [
            "username",
        ]);
        players_names.push(name.username);
        players.push({ id: match.players[index], name: name.username });
        if (match.status.player == match.players[index])
            match.status.player = name.username;
    }
    for (let index in match.attempts) {
        if (match.attempts[index].playerId == players[0].id)
            match.attempts[index].playerName = players[0].name;
        else match.attempts[index].playerName = players[1].name;
        delete match.attempts[index].playerId;
    }
    match.players = players_names;
    res.status(200).json({
        match: match,
    });
};

export const gameController = {
    doGuess,
    leaveMatch,
    getMatch,
};
