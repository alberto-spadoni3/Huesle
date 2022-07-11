import express from 'express';
import { gameController } from '../controllers/gameController.js';

const router = express.Router();

router.route('/doGuess').put(gameController.doGuess);

router.route('/leaveMatch').put(gameController.leaveMatch);

router.route('/leaveMatch').put(gameController.leaveMatch);

export default router;
