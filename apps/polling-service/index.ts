import { subscriber , publisher} from "shared-redis";
import { restartPolling } from "./pollingStart";
import { BINANCE_WS_URL, POLLING_ENGINE_EVENT_CHANNEL, POLLING_ENGINE_QUEUE_NAME} from "common"

interface msgType {
    type : "SUBSCRIBE" | "UNSUBSCRIBE"
    market : string
}
//   market , webSocket
let SUBSCRIBED_MARKETS : Map<string , WebSocket> = new Map() ;
async function main(){
    subscriber.subscribe(POLLING_ENGINE_EVENT_CHANNEL, (msg) => {
        const data: msgType =  JSON.parse(msg);
        if(data.type == "SUBSCRIBE"){
            handleSubscribeMarket(data.market);
        }else if (data.type === "UNSUBSCRIBE") {
            handleUnsubscribeMarket(data.market);
        }
    })
    restartPolling();

function handleSubscribeMarket(market: string){
    if(SUBSCRIBED_MARKETS.has(market)){
        return;
    }
    const webSocket = new WebSocket(
        `${BINANCE_WS_URL}${market.toLowerCase()}@trade`
    );
    webSocket.onopen = () => {
        SUBSCRIBED_MARKETS.set(market , webSocket);
    }
    webSocket.onmessage = async (msg) => {
        let tradeData = JSON.parse(msg.data);
        // pushing the trade Data to queue
        await publisher.lPush(
            POLLING_ENGINE_QUEUE_NAME,
            JSON.stringify(tradeData.data)
        )
        const tickerData= {
            buy: parseFloat(tradeData.data.p),
            sell : parseFloat(tradeData.data.p),
            market: tradeData.data.s ,
            time: tradeData.data.E
        }
        console.log(tickerData);
        // publish the data to pub sub 
        await publisher.publish(
            market.toLowerCase(),
            JSON.stringify(tickerData)
        )
    }

    webSocket.onclose = () => {
        SUBSCRIBED_MARKETS.delete(market);
    }
    webSocket.onerror = (err) => {
        console.log("Get Error on websocket connection", err);
    }
}

function handleUnsubscribeMarket(market : string){
    if(SUBSCRIBED_MARKETS.has(market)){
        const ws = SUBSCRIBED_MARKETS.get(market);
        ws?.close();
        SUBSCRIBED_MARKETS.delete(market)
    }
}
}

main()
