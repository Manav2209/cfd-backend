import { Router } from "express";
import { authMiddleware } from "../middleware";


export const assetRouter : Router = Router();

assetRouter.get("/" , authMiddleware , getAssets);
