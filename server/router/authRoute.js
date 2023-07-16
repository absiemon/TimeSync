import express from 'express';
import { login, logout, profile } from '../controllers/authCtrl.js';
const router = express.Router();



router.post("/login", login)

router.post("/logout", logout)
router.post("/profile", profile)



export default router;

