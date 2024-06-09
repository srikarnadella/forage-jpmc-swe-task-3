import { timeStamp } from "console";
import { ServerRespond } from "./DataStreamer";

export interface Row {
  stock: string;
  top_ask_price: number;
  timestamp: Date;
  price_abc: number;
  price_def: number;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC =
      serverResponds[0].top_ask.price + serverResponds[0].top_bid.price;

    const priceDEF =
      serverResponds[1].top_ask.price + serverResponds[1].top_bid.price;

    const ratio = priceABC / priceDEF;

    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return serverResponds.map((el: any) => {
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp:
          serverResponds[0].timestamp > serverResponds[1].timestamp
            ? serverResponds[0].timestamp
            : serverResponds[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert:
          ratio > upperBound || ratio < lowerBound ? ratio : undefined,
      };
    });
  }
}
