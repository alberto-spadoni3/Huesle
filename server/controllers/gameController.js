import dbManager from "./dbManager.js";

const searchMatch = (req, res) => {
    const username = req.query.username;
    if(req.query.hasOwnProperty("secret")) {
        const secret = req.query.secret;
        dbManager.searchMatch(username, secret);
    } else {
        dbManager.searchMatch(username);
    }
    res.status(200).send("<h2>Searching match</h2>");
}

const doAttempt = (req, res) => {
    const username = req.query.username;
    const matchId = req.query.matchId;
    const guess = req.query.guess;
    dbManager.findMatch(matchId).then(match => {
        let result1 = 0;
        let result2 = 0;
        return dbManager.addAttempt(matchId, username, guess, result1, result2);
    })
    res.status(200).send("<h2>Attempt pushed</h2>");
}

 const gameHandlers = {
    searchMatch,
     doAttempt
};

export default gameHandlers;