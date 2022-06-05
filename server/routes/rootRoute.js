import express from 'express';
import rootHandlers from '../controllers/rootController.js';
const router = express.Router();

router.route('/')
    .get(rootHandlers.index);
router.route('/register')
    .get(rootHandlers.register);
router.route('/login')
    .post(rootHandlers.login);


export default router;
