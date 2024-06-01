import express from 'express';
import { getStatistics } from '../controllers/statistics.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/',auth,getStatistics);


export default router