import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute";
import { tradeRouter } from "./routes/traderoute";
import { balanceRouter } from "./routes/balanceRoute";
import { candleRouter } from "./routes/candleRoute";
import { assetRouter } from "./routes/assetRoute";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/trade" , tradeRouter);
app.use("/api/v1/balance" , balanceRouter);
app.use("/api/v1/candles" , candleRouter);
app.use("/api/v1/assets" , assetRouter);

app.listen(4000 , () => {
    console.log('API server is running on http://localhost:4000');
})