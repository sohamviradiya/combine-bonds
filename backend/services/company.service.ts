import companyInterface, {
	createCompanyDto,
} from "backend/interfaces/company.interface";
import CompanyModel from "backend/models/company.schema";
const CompanyService = (() => {
	
	const addCompany = async (company: createCompanyDto) => {
		const newCompany = new CompanyModel({
			...company,
			stocks: [],
			market_capitalization: 0,
		});
		const newCompanyDoc = await newCompany.save();
		return newCompanyDoc;
	};
	const getCompanies = async () => {
		const data = await CompanyModel.find().exec();
		return data;
	};
	const getCompany = async (_id: string) => {
		return await CompanyModel.findById(_id).exec();
	};
	const updateMarketCap = async (_id: string) => {
		//
	};
	return {
		addCompany,
		getCompanies,
		getCompany,
		updateMarketCap,
	};
})();

export default CompanyService;
