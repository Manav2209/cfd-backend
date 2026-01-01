import { createClient } from "redis";
import { POLLING_ENGINE_QUEUE_NAME} from "common"
import { pool } from "timeseries-db";

async function main() { 
    
    const tradeData = [];
    const redisClient = await createClient().connect();

    while(true){
    const datafromQueue = await redisClient.brPop(POLLING_ENGINE_QUEUE_NAME , 0);
    
    if(datafromQueue){
        const data = JSON.parse(datafromQueue.element);
    
        const processedTrade = {
            tradeTime: new Date(data.T),
            symbol:data.s,
            price:parseFloat(data.p),
            quantity:parseFloat(data.q),
            tradeId: data.t,
        }
    
        tradeData.push(processedTrade);
        if(tradeData.length>=100){
            try {
                const query = `
                INSERT INTO trades ("tradeId", symbol, price, quantity, time)
                VALUES ${tradeData.map((trade) => `(${trade.tradeId}, '${trade.symbol}', ${trade.price}, ${trade.quantity}, '${trade.tradeTime.toISOString()}')`).join(", ")};
                `;  
                await pool.query(query);
                console.log(`Inserted ${tradeData.length} trades into the database.`);
                tradeData.length = 0;
            }catch(err){
                console.error("Error inserting trades:", err);
            }          
        }
    }
    
    }
}

main()