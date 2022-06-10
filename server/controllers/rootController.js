const index = (req, res) => {
    res.status(200).send("<h2>Server working</h2>");
};

const rootHandlers = {
    index,
};

export default rootHandlers;
