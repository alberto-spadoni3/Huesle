import express from "express";
import { userController } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(userController.handleUserRegistration);

router.route("/login").post(userController.handleUserLogin);

router.route("/refreshToken").get(userController.refreshAccessToken);

router.route("/logout").get(userController.handleUserLogout);

router.route("/settings").get(userController.getSettings);

router.route("/settings").put(userController.updateSettings);

export default router;
