export type ValuePoint = {
	date: Date;
	market_valuation: Number;
	volume_in_market: Number;
};

export enum STOCK_CLASSES {
	"Voting", // high volume dependence
	"Non-Voting", // high market sentiment dependence
	"Bond", // low random fluctuation, high market sentiment dependence
	"Debenture", // high random fluctuation, high market sentiment dependence, high volume dependence
};

type StockInterface = {
	name: String;
	gross_volume: Number;
	class: STOCK_CLASSES;
	timeline: [ValuePoint];
	createdAt: Date;
	company: String;
};

export default StockInterface;
