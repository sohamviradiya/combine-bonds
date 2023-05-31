import CompanyModel from "backend/models/company.schema";
import StockService from "backend/services/stock.service";

const StockGenerator = async () => {
	const company_ids = (await CompanyModel.find({}, { _id: 1 }).exec()).map(
		(company: { _id: string }) => company._id
	);
	return [
		...(await StockService.AddRandomStocks(company_ids, "Voting")),
		...(await StockService.AddRandomStocks(company_ids, "Bond")),
	];
};

export default StockGenerator;
