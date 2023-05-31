import BotInterface, { BOT_CLASS } from "backend/interfaces/bot.interface";
const generateWeights = (num: number) => {
	// sorted descending
	// sum = 1
	let weights = [];
	for (let i = 0; i < num; i++) {
		weights.push(Math.random());
	}
	weights.sort((a, b) => b - a);
	let sum = weights.reduce((a, b) => a + b, 0);
	weights = weights.map((w) => w / sum);
	return weights;
};
const generateRandomBot = (
	portfolio_id: string,
	trade_period: number
): BotInterface => {
	const bot_class = Object.values(BOT_CLASS)[
		Math.floor(Math.random() * 4)
	] as keyof typeof BOT_CLASS;
	let investment_amount_per_slot = {
		balance_dependence_parameter: 0,
		market_sentiment_dependence_parameter: 0,
	};
	let bundle_expansion = {
		parameter: 0,
		high_raise_investment_parameters: {
			parameter: 0,
			weight_distribution: Array<number>(),
		},
		lows_rising_investment_parameters: {
			parameter: 0,
			weight_distribution: Array<number>(),
		},
		random_investment_parameters: {
			parameter: 0,
			weight_distribution: Array<number>(),
		},
	};
	let bundle_filling = {
		parameter: 0,
		weight_distribution: Array<number>(),
	};
	let loss_aversion_parameter = Array<number>();
	switch (bot_class) {
		case "SAFE INVESTOR": {
			investment_amount_per_slot = {
				balance_dependence_parameter: 0.3 + Math.random() * 0.1,
				market_sentiment_dependence_parameter: 0.3 + Math.random() * 0.1,
			};
			bundle_expansion = {
				parameter: 0.2 + Math.random() * 0.1,
				high_raise_investment_parameters: {
					parameter: 0.3 + Math.random() * 0.1,
					weight_distribution: generateWeights(2),
				},
				lows_rising_investment_parameters: {
					parameter: 0.3 + Math.random() * 0.1,
					weight_distribution: generateWeights(2),
				},
				random_investment_parameters: {
					parameter: 0.2 + Math.random() * 0.1,
					weight_distribution: generateWeights(2),
				},
			};
			break;
		}
		case "AGGRESSIVE INVESTOR": {
			investment_amount_per_slot = {
				balance_dependence_parameter: 0.5 + Math.random() * 0.1,
				market_sentiment_dependence_parameter: 0.5 + Math.random() * 0.1,
			};
			bundle_expansion = {
				parameter: 0.4 + Math.random() * 0.1,
				high_raise_investment_parameters: {
					parameter: 0.3 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
				lows_rising_investment_parameters: {
					parameter: 0.3 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
				random_investment_parameters: {
					parameter: 0.2 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
			};
			break;
		}
		case "SPECULATIVE INVESTOR": {
			investment_amount_per_slot = {
				balance_dependence_parameter: 0.4 + Math.random() * 0.1,
				market_sentiment_dependence_parameter: 0.6 + Math.random() * 0.1,
			};
			bundle_expansion = {
				parameter: 0.2 + Math.random() * 0.1,
				high_raise_investment_parameters: {
					parameter: 0.4 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
				lows_rising_investment_parameters: {
					parameter: 0.4 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
				random_investment_parameters: {
					parameter: 0.2 + Math.random() * 0.1,
					weight_distribution: generateWeights(4),
				},
			};
			break;
		}
		case "DAY TRADER": {
			investment_amount_per_slot = {
				balance_dependence_parameter: 0.5 + Math.random() * 0.1,
				market_sentiment_dependence_parameter: 0.5 + Math.random() * 0.1,
			};
			bundle_expansion = {
				parameter: 0.5 + Math.random() * 0.1,
				high_raise_investment_parameters: {
					parameter: 0.2 + Math.random() * 0.1,
					weight_distribution: generateWeights(2),
				},
				lows_rising_investment_parameters: {
					parameter: 0.2 + Math.random() * 0.1,
					weight_distribution: generateWeights(2),
				},
				random_investment_parameters: {
					parameter: 0.6 + Math.random() * 0.1,
					weight_distribution: generateWeights(5),
				},
			};
		}
	}
	bundle_filling = {
		parameter: 1 - bundle_expansion.parameter,
		weight_distribution: [],
	};
	return {
		portfolio: portfolio_id,
		trade_period: trade_period,
		class: bot_class,
		parameters: {
			investment_amount_per_slot: investment_amount_per_slot,
			bundle_expansion: bundle_expansion,
			bundle_filling: bundle_filling,
			loss_aversion_parameter: [],
		},
	};
};
