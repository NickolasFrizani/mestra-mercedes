// lib/clob.js
// Executor REAL de ordens no CLOB da Polymarket. Importado dinamicamente
// apenas no modo live (lib/copytrade.js). Envia ordens FOK marketáveis,
// com `limitPrice` atuando como pior preço aceitável (proteção de slippage).

import { ClobClient, Side, OrderType } from "@polymarket/clob-client";
import { Wallet } from "ethers";

const HOST = process.env.POLYMARKET_CLOB_HOST || "https://clob.polymarket.com";
const POLYGON = 137;

export async function getClob(secrets) {
  const signer = Wallet.fromMnemonic(secrets.mnemonic);
  const creds = { key: secrets.apiKey, secret: secrets.secret, passphrase: secrets.passphrase };
  // EOA (type 0): funder = própria carteira. Proxy/Magic (1/2): funder informado.
  const funder = secrets.signatureType === 0 ? await signer.getAddress() : secrets.funderAddress;

  const client = new ClobClient(HOST, POLYGON, signer, creds, secrets.signatureType, funder);

  return {
    address: await signer.getAddress(),
    funder,
    async place(plan) {
      if (plan.side === "BUY") {
        return client.createAndPostMarketOrder(
          { tokenID: plan.tokenID, amount: plan.amountUsd, side: Side.BUY, price: plan.limitPrice },
          undefined,
          OrderType.FOK
        );
      }
      return client.createAndPostMarketOrder(
        { tokenID: plan.tokenID, amount: plan.amountShares, side: Side.SELL, price: plan.limitPrice },
        undefined,
        OrderType.FOK
      );
    },
  };
}
