import { Router } from "express";
import { postDemoChat } from "../controllers/demo.controller.js";

const router = Router();
router.post("/chat", postDemoChat);

export default router;
