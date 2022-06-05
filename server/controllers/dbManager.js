import mongoose from 'mongoose';

const DB_URL = "mongodb://localhost:27017";

mongoose.connect(DB_URL, {dbName: "huesle"})
    .then(() => console.log("DB ready"))
    .catch((error) => console.log(error.message));

class SchemaBuilder {
    userSchema = new mongoose.Schema({username: String, pswd: String, email: String});
    User = mongoose.model('User', this.userSchema, 'user');

    buildUser(username, pswd, email) {
        let user = new this.User();
        user.username = username;
        user.pswd = pswd;
        user.email = email;
        return user;
    };

    pendingSchema = new mongoose.Schema({playerId: String, secret: String});
    Pending = mongoose.model('Pending', this.pendingSchema, 'pendingPlayers');

    buildPending(playerId, secret) {
        let pendingMatch = new this.Pending();
        pendingMatch.playerId = playerId;
        pendingMatch.secret = secret;
        return pendingMatch;
    };

    attemptSchema = new mongoose.Schema({playerId: String, colorSequence: String,
        rightC: Number, rightP: Number, date: Date});
    Attempt = mongoose.model('Attempt', this.attemptSchema, 'attempt');

    buildAttempt(playerId, colorSequence, rightC, rightP, Date) {
        let attempt = new this.Attempt();
        attempt.playerId = playerId;
        attempt.colorSequence = colorSequence;
        attempt.rightC = rightC;
        attempt.rightP = rightP;
        attempt.date = mongoose.now();
        return attempt;
    }

    matchSchema = new mongoose.Schema({player1: String, player2: String, status: String,
        turn: Number, attempts: [], solution: String, date: Date});
    Match = mongoose.model('Match', this.matchSchema, 'match');

    buildMatch(player1, player2) {
        let match = new this.Match();
        match.player1 = player1;
        match.player2 = player2;
        match.status = "P1 TURN";
        match.turn = 0;
        match.attemps = new Array[this.Attempt]();
        match.solution = "CREATE SOLUTION";
        match.date = mongoose.now();
        return match;
    };
}

let schemaBuilder = new SchemaBuilder();

class DbManager {

    registerUser (username, pswd, email) {
        return schemaBuilder.buildUser(username, pswd, email).save();
    }

    loginUser (username, pswd) {
        return schemaBuilder.User.findOne({username: username, pswd: pswd}, 'username').then(account => {
            if (account != null) return true;
            else return false;
        }, error => {
            console.log(error);
        return false;
        });
    }

    #findUserId (username) {
        return schemaBuilder.User.findOne({username: username}, '_id')
    }

    searchMatch(username, secretCode = 0) {
        return Promise.all([schemaBuilder.Pending.findOneAndDelete({secret: secretCode}), this.#findUserId(username)]).then(values => {
            if(values[1] == null) console.log("User doesn't exist");
            else if (values[0] != null) return this.#createMatch(values[1]._id, values[0].playerId);
            else {
                schemaBuilder.buildPending(values[1]._id, secretCode).save();
            };
        }, error => {
            console.log(error);
            return false;
        });
    }

    findMatchesOfPlayer(username) {
        return this.#findUserId(username).then(id => {
            schemaBuilder.Match.find({$or:[ {'player1':id}, {'player2':id}]}, '_id')
        })
    }

    #createMatch(user1, user2) {
        return schemaBuilder.buildMatch(user1, user2).save();
    }

    findMatch(matchId) {
        return schemaBuilder.Match.findOne({_id: matchId})
    }

    addAttempt(matchId, username, guess, rightP, rightC) {
        Promise.all([this.findMatch(matchId), this.#findUserId(username)]).then(values => {
            let match = values[0];
            const attempt = schemaBuilder.buildAttempt(values[1]._id, guess, rightP, rightC);
            if(match.attemps == null) match.attemps = new Array();
            match.attempts.push(attempt);
            match.turn = match.turn + 1;
            match.status = "change of turns";
            return match.save();
        });


    }


}

export default new DbManager();