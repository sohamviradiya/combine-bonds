import BotInterface from "backend/interfaces/bot.interface";
import BotModel from "backend/models/bot.schema";

const BotService = (() => {
	const add = async (bot: BotInterface) => {
		const newBot = new BotModel({
			...bot,
		});
		return await newBot.save();
	};
	const getAll = async () => {
		return await BotModel.find({}).exec();
	};
	const get = async (bot_id: string) => {
		return await BotModel.findById(bot_id).exec();
	};
	return { add, getAll, get };
})();

export default BotService;
