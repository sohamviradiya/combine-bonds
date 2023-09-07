export enum BOT_STRATEGIES {
    "Safe" = "Safe",
    "Aggressive" = "Aggressive",
    "Speculative" = "Speculative",
    "Random" = "Random",
}

export type BOT_STRATEGY = keyof typeof BOT_STRATEGIES;


interface BotInterface {
    strategy: BOT_STRATEGY;
    trade_period: number;
    portfolio: string;
    parameters: {
        investment_amount_per_slot: {
            balance: number;
            market_sentiment: number;
        };
        bundle: {
            value: number;
            trending: {
                value: number;
                weights: number[];
            };
            predicted: {
                value: number;
                weights: number[];
            };
            random: {
                value: number;
                weights: number[];
            };
        };
        loss_aversion: number;
        stock_clearance: number;
    };
};

export type BotInterfaceWithID = BotInterface & {
    _id: string;
};

export default BotInterface;
