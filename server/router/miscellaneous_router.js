import express from 'express';
import { allData } from '../controllers/miscellaneousCtrl.js';
const router = express.Router();



router.get("/all_data", allData)


export default router;

