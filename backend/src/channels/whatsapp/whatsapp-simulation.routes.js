import { Router } from "express";
import { createWhatsAppSimulationController } from "./whatsapp-simulation.controller.js";

const router = Router();

router.post("/simulate", createWhatsAppSimulationController());

export default router;
