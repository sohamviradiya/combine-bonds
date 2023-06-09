import BotInterface, { BOT_CLASS } from "backend/interfaces/bot.interface";
import PortfolioModel from "backend/models/portfolio.schema";
import BotService from "backend/services/bot.service";
const generateWeights = (num: number) => {
	let weights = [];
	for (let i = 0; i < num; i++) {
		weights.push(Math.random());
	}
	weights.sort((a, b) => b - a);
	let sum = weights.reduce((a, b) => a + b, 0);
	weights = weights.map((w) => w / sum);
	return weights;
};

const generateBot = (portfolio_id: string, trade_period: number): BotInterface => {
	const bot_class = Object.values(BOT_CLASS)[Math.floor(Math.random() * 4)];
	let investment_amount_per_slot = {
		balance_dependence_parameter: 0,
		market_sentiment_dependence_parameter: 0,
	};
	let bundle_expansion_parameter = {
		value: 0,
		high_raise_investment_parameters: {
			value: 0,
			weight_distribution: Array<number>(),
		},
		lows_rising_investment_parameters: {
			value: 0,
			weight_distribution: Array<number>(),
		},
		random_investment_parameters: {
			value: 0,
			weight_distribution: Array<number>(),
		},
	};
	let bundle_filling_parameter = {
		value: 0,
		weight_distribution: Array<number>(),
	};
	let loss_aversion_parameter = 0;

	if (bot_class == "Safe") {
		investment_amount_per_slot = {
			balance_dependence_parameter: 0.3 + Math.random() * 0.1,
			market_sentiment_dependence_parameter: 0,
		};
		bundle_expansion_parameter = {
			value: 0.2 + Math.random() * 0.1,
			high_raise_investment_parameters: {
				value: 0.3 + Math.random() * 0.1,
				weight_distribution: generateWeights(1),
			},
			lows_rising_investment_parameters: {
				value: 0.3 + Math.random() * 0.1,
				weight_distribution: generateWeights(1),
			},
			random_investment_parameters: {
				value: 0,
				weight_distribution: generateWeights(0),
			},
		};
		loss_aversion_parameter = 0.05 + Math.random() * 0.1;
		bundle_filling_parameter.weight_distribution = generateWeights(3);
	} else if (bot_class == "Aggressive") {
		investment_amount_per_slot = {
			balance_dependence_parameter: 0.5 + Math.random() * 0.1,
			market_sentiment_dependence_parameter: 0,
		};
		bundle_expansion_parameter = {
			value: 0.4 + Math.random() * 0.1,
			high_raise_investment_parameters: {
				value: 0.3 + Math.random() * 0.1,
				weight_distribution: generateWeights(3),
			},
			lows_rising_investment_parameters: {
				value: 0.3 + Math.random() * 0.1,
				weight_distribution: generateWeights(3),
			},
			random_investment_parameters: {
				value: 0,
				weight_distribution: generateWeights(1),
			},
		};
		loss_aversion_parameter = 0.1 + Math.random() * 0.1;
		bundle_filling_parameter.weight_distribution = generateWeights(4);
	} else if (bot_class == "Speculative") {
		investment_amount_per_slot = {
			balance_dependence_parameter: 0.4 + Math.random() * 0.1,
			market_sentiment_dependence_parameter: 0.6 + Math.random() * 0.1,
		};
		bundle_expansion_parameter = {
			value: 0.2 + Math.random() * 0.1,
			high_raise_investment_parameters: {
				value: 0.4 + Math.random() * 0.1,
				weight_distribution: generateWeights(2),
			},
			lows_rising_investment_parameters: {
				value: 0.4 + Math.random() * 0.1,
				weight_distribution: generateWeights(2),
			},
			random_investment_parameters: {
				value: 0.2 + Math.random() * 0.1,
				weight_distribution: generateWeights(1),
			},
		};
		loss_aversion_parameter = 0.15 + Math.random() * 0.1;
		bundle_filling_parameter.weight_distribution = generateWeights(3);
	} else if (bot_class == "Random") {
		investment_amount_per_slot = {
			balance_dependence_parameter: 0.5 + Math.random() * 0.1,
			market_sentiment_dependence_parameter: 0.5 + Math.random() * 0.1,
		};
		bundle_expansion_parameter = {
			value: 0.5 + Math.random() * 0.1,
			high_raise_investment_parameters: {
				value: 0,
				weight_distribution: generateWeights(0),
			},
			lows_rising_investment_parameters: {
				value: 0,
				weight_distribution: generateWeights(0),
			},
			random_investment_parameters: {
				value: 1,
				weight_distribution: generateWeights(5),
			},
		};
		loss_aversion_parameter = 0.2 + Math.random() * 0.1;
		bundle_filling_parameter.weight_distribution = [];
	} else throw new Error("Bot class not found");

	investment_amount_per_slot.market_sentiment_dependence_parameter =
		1 - investment_amount_per_slot.balance_dependence_parameter;
	bundle_filling_parameter.value = 1 - bundle_expansion_parameter.value;
	bundle_expansion_parameter.random_investment_parameters.value =
		1 -
		bundle_expansion_parameter.high_raise_investment_parameters.value -
		bundle_expansion_parameter.lows_rising_investment_parameters.value;

	return {
		portfolio: portfolio_id,
		trade_period: trade_period,
		bot_class,
		parameters: {
			investment_amount_per_slot: investment_amount_per_slot,
			bundle_expansion_parameter: bundle_expansion_parameter,
			bundle_filling_parameter: bundle_filling_parameter,
			loss_aversion_parameter,
		},
	} as BotInterface;
};

const BotGenerator = async () => {
	const portfolio_ids = (await PortfolioModel.find({}, { _id: 1 }).exec()).map(
		(portfolio: { _id: string }) => portfolio._id
	);
	return Promise.all(
		portfolio_ids.map(async (portfolio_id: string) => {
			await BotService.add(generateBot(portfolio_id, 1));
		})
	);
};

export default BotGenerator;
