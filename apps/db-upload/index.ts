import { createClient } from "redis";
import { POLLING_ENGINE_QUEUE_NAME} from "common"

async function main() { 
    const tradeData = [];

    const redisClient = await createClient().connect();
    while(true){
    const data = await redisClient.brPop(POLLING_ENGINE_QUEUE_NAME , 0);

    console.log(data?.element)
    }
}

main()