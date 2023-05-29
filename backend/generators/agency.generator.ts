import AgencyService from "backend/services/agency.service";
import StockModel from "backend/models/stock.schema";
export async function generate_all() {
	const stock_ids = await StockModel.find({}).select("_id").exec();
	console.log(stock_ids);
	return await Promise.all(
		stock_ids.map(
			async (stock) =>
				await AgencyService.addAgency(
					await AgencyService.generateAgency(stock._id)
				)
		)
	);
}
