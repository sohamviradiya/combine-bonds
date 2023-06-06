import MarketModel from "backend/models/market.schema";

const MarketService = (() => {
	const get = async () => {
		return await MarketModel.aggregate([
			{
				$group: {
					_id: null,
					max: { $max: "$date" },
				},
			},
		]).exec();
	};
	const getTimeline = async () => {
		return await MarketModel.find().exec();
	};
	const getRelativeCumulativeMarketCapitalization = async () => {
		const [Market, prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(2).exec();
		return (
			(Market.cumulative_market_capitalization - prevMarket.cumulative_market_capitalization) /
			prevMarket.cumulative_market_capitalization
		);
	};
	const getRelativeCumulativeNetWorth = async () => {
		const [Market, prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(2).exec();
		return (Market.cumulative_net_worth - prevMarket.cumulative_net_worth) / prevMarket.cumulative_net_worth;
	};
	const getDate = async () => {
		const [Market] = await MarketModel.find({}).sort({ date: -1 }).limit(1).exec();
		return Market.date;
	};

	return { get, getTimeline, getRelativeCumulativeMarketCapitalization, getRelativeCumulativeNetWorth };
})();

export default MarketService;
