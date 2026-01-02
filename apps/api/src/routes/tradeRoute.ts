import { Router } from "express";
import { authMiddleware } from "../middleware";
import { getOpenTrade , getCloseTrade, createTrade } from "../services/tradeService";


export const tradeRouter : Router = Router();
tradeRouter.post("/" , authMiddleware, createTrade );
tradeRouter.get("/open" ,authMiddleware , getOpenTrade);
tradeRouter.get("/close" ,authMiddleware , getCloseTrade);
