import { StockInterface } from "types/stock.interface";
import MarketModel from "@/server/models/market.schema";
import StockModel from "@/server/models/stock.schema";
import PortfolioInterface from "types/portfolio.interface";
import PortfolioModel from "@/server/models/portfolio.schema";
import { DATE_LIMIT } from "types/market.interface";
const MarketService = (() => {
	const get = async () => {
		return await MarketModel.find({}).sort({ date: -1 }).exec();
	};
	const getTimeline = async () => {
		return await MarketModel.find().exec();
	};
	const getRelativeCumulativeMarketCapitalization = async () => {
		const [Market, prevMarket] = await MarketModel.find({})
			.sort({ date: -1 })
			.limit(2)
			.exec();
		if (!prevMarket) return 0;
		return (
			(Market.cumulative_market_capitalization -
				prevMarket.cumulative_market_capitalization) /
			prevMarket.cumulative_market_capitalization
		);
	};
	const getRelativeCumulativeNetWorth = async () => {
		const [Market, prevMarket] = await MarketModel.find({})
			.sort({ date: -1 })
			.limit(2)
			.exec();
		if (!prevMarket) return 0;
		return (
			(Market.cumulative_net_worth - prevMarket.cumulative_net_worth) /
			prevMarket.cumulative_net_worth
		);
	};
	const getDate = async () => {
		const [Market] = await MarketModel.find({}, { date: 1 })
			.sort({ date: -1 })
			.limit(1)
			.exec();
		if (!Market) return 0;
		return Market.date;
	};
	const evaluate = async (new_date: number) => {
		await MarketModel.deleteMany({
			date: { $lte: new_date - DATE_LIMIT },
		}).exec();
		const stocks: StockInterface[] = await StockModel.find(
			{},
			{ timeline: 1 }
		).exec();
		const market_caps = stocks.map(
			(stock) => stock.timeline[stock.timeline.length - 1].market_valuation
		);
		const cumulative_market_capitalization = market_caps.reduce(
			(a, b) => a + b,
			0
		);

		const portfolios: PortfolioInterface[] = await PortfolioModel.find(
			{},
			{ netWorth: 1 }
		).exec();

		const net_worths = portfolios.map(
			(portfolio) => portfolio.netWorth[portfolio.netWorth.length - 1].value
		);
		const cumulative_net_worth = net_worths.reduce((a, b) => a + b, 0);

		const new_market = new MarketModel({
			date: new_date,
			cumulative_market_capitalization,
			cumulative_net_worth,
		});
		await new_market.save();
	};

	return {
		get,
		getTimeline,
		getRelativeCumulativeMarketCapitalization,
		getRelativeCumulativeNetWorth,
		getDate,
		evaluate,
	};
})();

export default MarketService;
