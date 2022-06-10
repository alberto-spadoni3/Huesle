import express from "express";
import rootHandlers from "../controllers/rootController.js";
const router = express.Router();

router.route("/").get(rootHandlers.index);

export default router;
