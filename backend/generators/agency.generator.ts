import AgencyService from "backend/services/agency.service";
import StockModel from "backend/models/stock.schema";

const AgencyGenerator = async () => {
	const stock_ids = await StockModel.find({}, { _id: 1 }).exec();
	return await Promise.all(
		stock_ids.map(
			async (stock) =>
				await AgencyService.addAgency(
					await AgencyService.generateAgency(stock._id)
				)
		)
	);
};

export default AgencyGenerator;
