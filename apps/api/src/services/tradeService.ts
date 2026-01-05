import type { Request , Response } from "express";
import type { AuthRequest } from "../middleware";
import { redis } from "shared-redis";

interface ICreateTradeRequest {
    type: "market" | "limit";
    leverage: number;
    QTY: number;
    TP?: number;
    SL?: number;
    market: string;
    side: "buy" | "sell";
}

export interface IOpenOrderRes {
    orderId : string , 
    type: "market"| "limit",
    side: "buy" | "sell",
    margin ?: number ,
    QTY : number
    leverage ?: number,
    openPrice: number;
    TP ?: number, 
    SL ?:number ,
    createdAt : string
}

export interface IClosedOrderRes extends IOpenOrderRes{
    closePrice : number ,
    pnl : number
}

interface IGetOpenOrdersResponse {
    orders: IOpenOrderRes[];
}

interface IGetClosedOrdersResponse{
    orders : IClosedOrderRes[];
}


export const createTrade  = async ( req : AuthRequest , res : Response) => {
    const userId = req.userId;

    if(!userId){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const { type, leverage, QTY, TP, SL, market, side } =
    req.body as ICreateTradeRequest;

    if (!type || !market || !QTY) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }
    const user = await redis.hGetAll(userId);

    if(!user || !user.balance){
        res.status(401).json({
            message : "User does not have enough balance"
        })
    }

    const data = {
        type , 
        side , 
        QTY ,
        TP,
        SL,
        market,
        balance: user.balance,
        userId: userId,
        leverage,
    }
    const orderId = await Engine.process(data);

    return res.status(200).json({orderId});
}

export const getOpenTrade = (req : Request , res : Response) => {

}

export const getCloseTrade = (req : Request , res : Response) => {

}

