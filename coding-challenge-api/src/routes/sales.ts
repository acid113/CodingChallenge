import express from "express";
import salesFunction from "../controllers/sale";
// import getSales from "./../controllers/sale";

const router = express.Router();

// router.get("/sales", getSales);
router.get("/sales", salesFunction.getSales);

export default router;
