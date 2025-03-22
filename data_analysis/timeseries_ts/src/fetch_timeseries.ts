import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";
import {
    ApiKeyCreds,
    Chain,
    ClobClient,
    PriceHistoryFilterParams,
    PriceHistoryInterval,
} from  "@polymarket/clob-client";

dotenvConfig({ path: resolve(__dirname, ".env") });

async function main() {
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    const YES_TOKEN_ID = "51973331945880957072599010054618681509307274170552732113727065440341771479322"; 
    const NO_TOKEN_ID = "105637525420107465016899790388284587220624374177780103002517436285549579895981";
    const yes_prices_history = await clobClient.getPricesHistory({
        startTs: new Date().getTime() / 1000 - 1000,
        endTs: new Date().getTime() / 1000,
        market: YES_TOKEN_ID,
    } as PriceHistoryFilterParams);

    writeFileSync("yes_prices.json", JSON.stringify(yes_prices_history, null, 2));
    console.log("Saved yes_prices.json");

    const no_prices_history = await clobClient.getPricesHistory({
        startTs: new Date().getTime() / 1000 - 1000,
        endTs: new Date().getTime() / 1000,
        market: NO_TOKEN_ID,
    } as PriceHistoryFilterParams);

    writeFileSync("no_prices.json", JSON.stringify(no_prices_history, null, 2));
    console.log("Saved no_prices.json");

    // Optional interval history example:
    const one_hour_history = await clobClient.getPricesHistory({
        market: YES_TOKEN_ID,
        interval: PriceHistoryInterval.ONE_HOUR,
        fidelity: 1,
    } as PriceHistoryFilterParams);

    writeFileSync("one_hour_history.json", JSON.stringify(one_hour_history, null, 2));
    console.log("Saved one_hour_history.json");
}

main().catch(console.error);

