import express from 'express';
import gameHandlers from '../controllers/gameController.js';
const router = express.Router();

router.route('/searchMatch')
    .post(gameHandlers.searchMatch);
router.route('/doAttempt')
    .put(gameHandlers.doAttempt);

export default router;
