import companyInterface, {
	COMPANY_FIELDS,
	COMPANY_FORMS,
	createCompanyDto,
} from "backend/interfaces/company.interface";
import CompanyModel from "backend/models/company.schema";
import { faker } from "@faker-js/faker";
const CompanyService = (() => {
	const generateRandomCompany = (): createCompanyDto => {
		return {
			name: faker.science.chemicalElement().name,
			field: Object.values(COMPANY_FIELDS)[Math.floor(Math.random() * 14)],
			form: Object.values(COMPANY_FORMS)[Math.floor(Math.random() * 7)],
			established: faker.date.past(),
			description: faker.lorem.paragraph(),
			assets: Math.floor(Math.random() * 10000000000),
			headquarters: faker.location.street() + ", " + faker.location.city(),
			employees: Math.floor(Math.random() * 100000),
		} as createCompanyDto;
	};
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
		generateRandomCompany,
		addCompany,
		getCompanies,
		getCompany,
		updateMarketCap,
	};
})();

export default CompanyService;
