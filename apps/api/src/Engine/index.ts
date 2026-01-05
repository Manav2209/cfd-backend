import type { IOpenOrderRes , IClosedOrderRes} from "../services/tradeService";
import { redis } from "shared-redis";

interface TradeData {
    type : 'market' | 'leverage', 
    side : 'buy' | 'sell' , 
    QTY  : number , // decimal
    TP ?: number, // raw price ->  not scales
    SL ?: number, //  raw
    market : string, // eg SOLUSDT
    balance: string,
    userId: string,
    leverage : number,
}

const SCALE=100;

export const multipler = (x: number | string) => Math.round(Number(x) * SCALE);  
export const divider = (x: number | string) => Number(x) / SCALE;

export type Balance = {
    usd :number // scale
    locked_usd : number;
    [asset: string]: any;
}

export interface OPEN_ORDERS extends IOpenOrderRes {
    userId: string;
}

export interface CLOSED_ORDERS extends IClosedOrderRes {
    userId: string;
}

export class Engine{

    private constructor () {};

    static async getUserData( userId : string){
        const data = await redis.hGetAll(userId);
        if (!data || !data.balance) throw new Error("User data not found");

        const balance = data.balance ? JSON.parse(data.balance) : {usd :0 , locked_usd :0};
        return{
            ...data , 
            balance: balance,
            assets : data.assets ? JSON.parse(data.assets) : {},
            borrowedAssets: data.borrowedAssets ? JSON.parse(data.borrowedAssets) : {},
        }
    }
    
    static async process (data : TradeData) {


        // 1st step -  Toget the market price of the market 
        const market = data.market.toLowerCase();
        const tradeData = await redis.get(`trade:${market}`);
        console.log(tradeData);
        if(!tradeData){
            throw new Error(`No trade data for market: ${market}`);
        }
        const {buy , sell} = JSON.parse(tradeData);
        const buyPriceScaled = multipler(buy);
        const sellPriceScaled =  divider(sell);

        // 2nd step - get user data
        let user = await this.getUserData(data.userId);
        let bal = user.balance as Balance;

        

    }
}




const dataToTest = {
    type : 'market', 
    side : 'buy' , 
    QTY  : 10 , // decimal
    market : "SOLUSDT", // eg SOLUSDT
    balance: 10000,
    userId: "abc1234",
    leverage : 40,
}
//@ts-ignore
const check =await  Engine.process(dataToTest)