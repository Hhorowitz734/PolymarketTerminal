
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
} from "@polymarket/clob-client";

// Load environment variables
dotenvConfig({ path: resolve(__dirname, ".env") });

async function main() {
    // Parse command-line arguments
    const args = process.argv.slice(2);

    if (args.length < 5) {
        console.error('Missing parameters: market, startTs, endTs, interval, fidelity');
        process.exit(1);
    }

    const market = args[0]; // Market token ID
    const startTs = parseInt(args[1]); // Start timestamp (Unix)
    const endTs = parseInt(args[2]); // End timestamp (Unix)
    const interval = args[3] as PriceHistoryInterval; // Interval string
    const fidelity = parseInt(args[4]); // Fidelity (resolution in minutes)

    // Set up wallet and chain
    const wallet = new ethers.Wallet(`${process.env.PK}`);
    const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
    console.log(`Address: ${await wallet.getAddress()}, chainId: ${chainId}`);

    // API client credentials
    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, chainId, wallet, creds);

    // Fetch price history for the market
    const priceHistory = await clobClient.getPricesHistory({
        startTs,
        endTs,
        market,
        interval,
        fidelity,
    } as PriceHistoryFilterParams);

    // Generate file name from market ID
    const marketName = market.substring(0, 5);
    const fileName = `${marketName}_history.json`;

    // Save to JSON file
    writeFileSync(fileName, JSON.stringify(priceHistory, null, 2));
    console.log(`Saved ${fileName}`);
}

main().catch(console.error);
