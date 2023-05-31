import BotInterface from "backend/interfaces/bot.interface";
import BotModel from "backend/models/bot.schema";

const BotService = (() => {
	const addBot = async (bot: BotInterface) => {
		return await new BotModel({
			...bot,
		}).save();
	};
	const getBots = async () => {
		return await BotModel.find({}).exec();
	};
	const getBot = async (bot_id: string) => {
		return await BotModel.findById(bot_id).exec();
     };
     return {
          addBot,
          getBots,
          getBot,
     };
})();

export default BotService;
