import { Router } from "express";
import { authMiddleware } from "../middleware";
import { getBalance } from "../services/balanceService";


export const balanceRouter : Router = Router();

balanceRouter.get("/" , authMiddleware , getBalance);