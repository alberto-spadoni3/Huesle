import cors from "cors";

const allowedOrigins = ["http://localhost:3000", "http://localhost"];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "origin",
        "Accept",
        "X-Requested-With",
    ],
    credentials: true,
    methods: "GET,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
};

export default cors(corsOptions);
