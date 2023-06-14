export type ValuePoint = {
	date: number;
	market_valuation: number;
	volume_in_market: number;
};

export enum STOCK_CLASS {
	"Voting" = 0, 
	"Non-Voting" = 1, 
	"Bond" = 2,
	"Debenture" = 3, 
}

export type StockInterface = {
	name: string;
	gross_volume: number;
	class: keyof typeof STOCK_CLASS;
	timeline: ValuePoint[];
	createdAt: Date;
	company: string;
	traders: string[];
};

export type StockInterfaceWithID = StockInterface & StockValues;

export type StockValues = {
	_id: string;
	slope: number;
	price: number;
	double_slope: number;
	rise_since_trough: number;
};

export type createStockDto = Omit<StockInterface, "createdAt" | "traders">;
