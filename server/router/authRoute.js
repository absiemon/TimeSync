import express from 'express';
import { login, logout, profile } from '../controllers/authCtrl.js';
import verifyToken from '../middleware/verifyTokne.js';
const router = express.Router();



router.post("/login", login)

router.post("/logout", logout)
router.post("/profile", verifyToken, profile);



export default router;

