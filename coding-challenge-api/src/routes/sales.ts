import express from "express";
import { getSales } from "../controllers/sale";

const router = express.Router();

router.get("/sales", getSales);

export default router;
