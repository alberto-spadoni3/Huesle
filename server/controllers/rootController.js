import dbManager from "./dbManager.js";

const index = (req, res) => {
    res.status(200).send("<h2>Server working</h2>");
 }

const register = (req, res) => {
    const username = req.query.username;
    const pswd = req.query.pswd;
    const email = req.query.email;
    dbManager.registerUser(username, pswd, email)
        .then(newUser => {
            res.status(200).send("<h2>User " + username + " registered with id " + newUser._id + "</h2>");
        })
}

const login = (req, res) => {
    const username = req.query.username;
    const pswd = req.query.pswd;
    dbManager.loginUser(username, pswd)
        .then(outcome => {
            if(outcome)
                res.status(200).send("<h2>" + username + " logged in!</h2>");
            else res.status(404).send("<h2>" + username + " not found!</h2>");
        }).catch()
}

const searchMatch = (req, res) => {
    const username = req.query.username;
    if(req.query.hasOwnProperty("secret")) {
        const secret = req.query.secret;
        dbManager.searchMatch(username, secret);
    } else {
        dbManager.searchMatch(username);
    }
    res.status(200).send();
}

 const rootHandlers = {
    index,
    register,
    login,
    searchMatch
};

export default rootHandlers;