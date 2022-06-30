import express from 'express';
import { gameController } from '../controllers/gameController.js';

const router = express.Router();

router.route('/searchMatch').post(gameController.searchMatch);

router.route('/searchMatch').delete(gameController.leaveSearchPrivateMatch);

router.route('/doGuess').put(gameController.doGuess);

router.route('/leaveMatch').put(gameController.leaveMatch);

router.route('/leaveMatch').put(gameController.leaveMatch);

router.route('/getMatch').get(gameController.getMatch);

router.route('/activeMatches').get(gameController.getActiveMatchesOfUser);

router.route('/ongoingMatches').get(gameController.getOngoingMatches);

router.route('/allMatches').get(gameController.getAllMatchesOfUser);

router.route('/userStats').get(gameController.getUserStats);

export default router;
