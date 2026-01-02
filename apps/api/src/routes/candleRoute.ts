import { Router } from "express";
import { authMiddleware } from "../middleware";
import { getCandles } from "../services/candleService";


export const candleRouter : Router = Router();

candleRouter.get("/" , authMiddleware , getCandles);