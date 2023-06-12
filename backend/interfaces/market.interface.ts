type MarketInterface = {
	date: number;
	cumulative_market_capitalization: number;
	cumulative_net_worth: number;
	market_sentience_index: number;
};

export const MARKET_BASE = 1000;

export const DATE_LIMIT = 15;

export default MarketInterface;
