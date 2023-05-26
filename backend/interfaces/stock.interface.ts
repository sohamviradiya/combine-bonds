

export type ValuePoint = {
	date: Date;
	market_valuation: Number;
	volume_in_market: Number;
};

type StockInterface = {
	name: String;
	gross_volume: Number;
	timeline: [ValuePoint];
	createdAt: Date;
	company: String;
};

export default StockInterface;
