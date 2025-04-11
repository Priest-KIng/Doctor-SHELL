import express from "express";
import { doctorSignup, login, logout, userSignup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/doctorSignup", doctorSignup);
router.post("/userSignup", userSignup);

router.post("/login", login);

router.post("/logout", logout);

export default router;