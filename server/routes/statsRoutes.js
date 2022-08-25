import express from 'express';
import { statsController } from '../controllers/statsController.js';

const router = express.Router();

router.route('/activeMatches').get(statsController.getActiveMatchesOfUser);

router.route('/ongoingMatches').get(statsController.getOngoingMatches);

router.route('/allMatches').get(statsController.getAllMatchesOfUser);

router.route('/userStats').get(statsController.getUserStats);

router.route('/notifications').get(statsController.getNotifications);

router.route('/newNotifications').get(statsController.areNewNotifications);

router.route('/notifications').post(statsController.signalNotificationsRead);

export default router;
