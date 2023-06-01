export type ValuePoint = {
	date: number;
	market_valuation: number;
	volume_in_market: number;
};

export enum STOCK_CLASS {
	"Voting" = 0, // high volume dependence
	"Non-Voting" = 1, // high market sentiment dependence
	"Bond" = 2, // low random fluctuation, high market sentiment dependence
	"Debenture" = 3, // high random fluctuation, high market sentiment dependence, high volume dependence
}

export type StockInterface = {
	name: string;
	gross_volume: number;
	class: keyof typeof STOCK_CLASS;
	timeline: ValuePoint[];
	createdAt: Date;
	company: string;
};

export type StockInterfaceWithID = StockInterface & {
	_id: string;
	slope: number;
	price: number;
	double_slope: number;
};

export type createStockDto = Omit<StockInterface, "createdAt">;
