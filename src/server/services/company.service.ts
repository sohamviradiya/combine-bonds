import CompanyInterface, {
	CompanyInterfaceWithId,
	createCompanyDto,
} from "@/server/types/company.interface";
import CompanyModel from "@/server/models/company.schema";
import { STOCK_CLASS, StockInterfaceWithID } from "../types/stock.interface";
const CompanyService = (() => {
	const add = async (company: createCompanyDto) => {
		const newCompany = new CompanyModel({
			...company,
			stocks: [],
			market_capitalization: 0,
		});
		const newCompanyDoc = await newCompany.save();
		return newCompanyDoc;
	};
	const getAll = async () => {
		const data = await CompanyModel.find().exec();
		return data;
	};
	const get = async (_id: string) => {
		return {
			...(await CompanyModel.findById(_id).exec())._doc,
		} as CompanyInterfaceWithId;
	};
	const evaluate = async (_id: string, date: number) => {
		const data = await CompanyModel.findById(_id)
			.select("stocks")
			.populate("stocks.ref")
			.exec();
		const market_capitalization = data.stocks.reduce(
			(
				acc: number,
				stock: { class: keyof typeof STOCK_CLASS; ref: StockInterfaceWithID }
			) => {
				return (
					acc +
					stock.ref.timeline[stock.ref.timeline.length - 1].market_valuation
				);
			},
			0
		);
		CompanyModel.findByIdAndUpdate(_id, {
			market_capitalization,
		}).exec();
	};
	return { add, getAll, get, evaluate };
})();

export default CompanyService;
