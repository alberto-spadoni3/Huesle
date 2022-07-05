import express from 'express';
import { searchController } from '../controllers/searchController.js';

const router = express.Router();

router.route('/searchMatch').post(searchController.searchMatch);

router.route('/searchPrivateMatch').post(searchController.searchPrivateMatch);

router.route('/searchMatch').delete(searchController.leaveSearchPrivateMatch);

export default router;
