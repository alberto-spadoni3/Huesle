import express from "express";
import { settingController } from "../controllers/settingController.js";

const router = express.Router();

router.route("/updateEmail").post(settingController.updateEmail);

router.route("/updateUsername").post(settingController.updateUsername);

router.route("/updatePassword").post(settingController.updatePassword);

router
    .route("/profileSetting")
    .get(settingController.getSettings)
    .put(settingController.updateSettings);

router
    .route("/profilePics")
    .get(settingController.getUserPic)
    .put(settingController.updateProfilePic);

export default router;
