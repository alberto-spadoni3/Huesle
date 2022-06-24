import express from "express";
import { settingController } from "../controllers/settingController.js";

const router = express.Router();

router.route("/updateUsername").post(settingController.updateUsername);

router.route("/updatePassword").post(settingController.updatePassword);

router.route("/profileSetting").get(settingController.getSettings);

router.route("/profileSetting").put(settingController.updateSettings);

router.route("/getProfilePics").get(settingController.getAvailableProfilePics);

router.route("/updateProfilePics").put(settingController.updateProfilePic);

export default router;
