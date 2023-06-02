export enum BOT_CLASS {
	"Safe", 
	"Aggressive", 
	"Speculative",
	"Random", 
}

type BotInterface = {
	bot_class: keyof typeof BOT_CLASS;
	trade_period: number;
	portfolio: string;
	parameters: {
		investment_amount_per_slot: {
			balance_dependence_parameter: number;
			market_sentiment_dependence_parameter: number;
		};
		bundle_expansion: {
			parameter: number;
			high_raise_investment_parameters: {
				parameter: number;
				weight_distribution: number[];
			};
			lows_rising_investment_parameters: {
				parameter: number;
				weight_distribution: number[];
			};
			random_investment_parameters: {
				parameter: number;
				weight_distribution: number[];
			};
		};
		bundle_filling: {
			parameter: number;
			weight_distribution: number[];
		};
		loss_aversion_parameter: {
			reference_price: number;
			tolerable_relative_loss: number;
			stock: string;
		}[];
	};
};

export type BotInterfaceWithID = BotInterface & {
	_id: string;
};

export default BotInterface;
