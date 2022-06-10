import dbManager from "./dbManager.js";

const index = (req, res) => {
    res.status(200).send("<h2>Server working</h2>");
 }

 const rootHandlers = {
    index,
    searchMatch
};

export default rootHandlers;