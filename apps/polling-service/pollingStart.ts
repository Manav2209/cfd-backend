import { POLLING_ENGINE_EVENT_CHANNEL } from "common";
import { publisher } from "shared-redis";

const markets = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "LTCUSDT", "SOLUSDT"];

export async function restartPolling() {
    console.log("starting the polling of Data")

    for(const market of markets){
        const data = {
            type: "SUBSCRIBE",
            market: market
        }
        await publisher.publish(POLLING_ENGINE_EVENT_CHANNEL , JSON.stringify(data))
    }

}