import { Router } from "express";
import { createCustomerController } from "../controllers/customer.controller.js";

const router = Router();
router.post("/", createCustomerController);

export default router;
