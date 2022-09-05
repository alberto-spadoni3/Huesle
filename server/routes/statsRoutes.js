import express from "express";
import { statsController } from "../controllers/statsController.js";

const router = express.Router();

router.route("/activeMatches").get(statsController.getActiveMatchesOfUser);

router.route("/ongoingMatches").get(statsController.getOngoingMatches);

router.route("/allMatches").get(statsController.getAllMatchesOfUser);

router.route("/userStats").get(statsController.getUserStats);

router
    .route("/notifications")
    .get(statsController.getNotifications)
    .post(statsController.signalNotificationsRead);

router.route("/newNotifications").get(statsController.areNewNotifications);

export default router;
