import dbManager from "./dbManager.js";

const index = (req, res) => {
    res.status(200).send("<h2>Server working</h2>");
 }

const register = (req, res) => {
    const username = req.query.username;
    const hashedpswd = req.query.hashedpswd;
    const email = req.query.email;
    dbManager.registerUser(username, hashedpswd, email)
        .then(newUser => {
            res.status(200).send("<h2>User " + username + " registered with id " + newUser._id + "</h2>");
        })
}

 const rootHandlers = {
    index,
    register
};

export default rootHandlers;