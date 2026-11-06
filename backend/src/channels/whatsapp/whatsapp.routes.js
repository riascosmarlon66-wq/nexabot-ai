import { Router } from "express";
import { createWhatsAppController } from "./whatsapp.controller.js";

const router = Router();
const controller = createWhatsAppController();

router.get("/", controller.verifyWebhook);
router.post("/", controller.receiveWebhook);

export default router;
