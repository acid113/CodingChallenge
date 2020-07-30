import express from "express";
import getUser from "../controllers/user";

const router = express.Router();

router.get("/user", getUser);

export default router;
