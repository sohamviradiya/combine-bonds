import MarketModel from "backend/models/market.schema";

const MarketService = (() => {
	const getMarket = async () => {
		return await MarketModel.aggregate([
			{
				$group: {
					_id: null,
					max: { $max: "$date" },
				},
			},
		]).exec();
	};
	const getMarketTimeline = async () => {
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
	return { getMarket, getMarketTimeline, getRelativeCumulativeMarketCapitalization, getRelativeCumulativeNetWorth };
})();

export default MarketService;
