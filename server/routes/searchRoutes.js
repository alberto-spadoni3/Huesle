import express from 'express';
import { searchController } from '../controllers/searchController.js';

const router = express.Router();

router.route('/searchMatch').post(searchController.searchMatch);

router.route('/searchMatch').delete(searchController.leaveSearchPrivateMatch);

router.route('/joinPrivateMatch').post(searchController.joinPrivateMatch);

export default router;
