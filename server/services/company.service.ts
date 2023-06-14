import companyInterface, { createCompanyDto } from "backend/interfaces/company.interface";
import CompanyModel from "backend/models/company.schema";
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
		return await CompanyModel.findById(_id).exec();
	};
	const evaluate = async (_id: string) => {
		//
	};
	return { add, getAll, get, evaluate };
})();

export default CompanyService;
