import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const accessToken = authHeader.split(" ")[1];

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decodedToken) => {
            if (error) {
                return res.sendStatus(403); // the token is invalid
            }
            req.username = decodedToken.username;
            next();
        }
    );
};
