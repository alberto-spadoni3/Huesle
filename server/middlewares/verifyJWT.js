import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, "secret", (error, decodedToken) => {
        if (error) {
            return res.sendStatus(403); // the token is invalid
        }
        req.user = decodedToken.username;
        next();
    });
};
