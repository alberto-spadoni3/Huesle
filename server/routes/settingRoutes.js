import express from "express";
import { settingController } from "../controllers/settingController.js";

const router = express.Router();

router.route("/updateUsername").post(settingController.updateUsername);

router.route("/updatePassword").post(settingController.updatePassword);

router
    .route("/profileSetting")
    .put(settingController.updateSettings)
    .get(settingController.getSettings);

router
    .route("/profilePics")
    .get(settingController.getAvailableProfilePics)
    .put(settingController.updateProfilePic);

export default router;
