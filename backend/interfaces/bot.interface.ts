export enum BOT_CLASS {
	"SAFE INVESTOR" = 0, // high bundle filling, low bundle expansion, very high trade period
	"AGGRESSIVE INVESTOR" = 1, // high random investment, low trade period
	"SPECULATIVE INVESTOR" = 2, // low random investment, high trade period
	"DAY TRADER" = 2, // high bundle expansion, low bundle filling, low trade period
}

type BotInterface = {
	class: keyof typeof BOT_CLASS;
	trade_period: number; // in slots (1 slot = 15 minute)
	portfolio: String;
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
		}[];
	};
};

export default BotInterface;
