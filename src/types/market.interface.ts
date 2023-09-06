interface MarketInterface {
    date: number;
    cumulative_market_capitalization: number;
    cumulative_net_worth: number;
    market_sentience_index: number;
    trending_stocks: string[];
    predicted_stocks: string[];
};

export default MarketInterface;
