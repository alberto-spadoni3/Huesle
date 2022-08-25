import express from "express";
import { userController } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(userController.handleUserRegistration);

router.route("/login").post(userController.handleUserLogin);

router.route("/refreshToken").get(userController.refreshAccessToken);

router.route("/logout").get(userController.handleUserLogout);

router.route("/forgotPassword").get(userController.handleResetPasswordRequest);

router.route("/checkRequestToken").post(userController.checkResetPasswordToken);

router.route("/resetPassword").post(userController.resetPassword);

export default router;
