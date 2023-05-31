import CompanyService from "backend/services/company.service";
import companyInterface, {
	COMPANY_FIELDS,
	COMPANY_FORMS,
	createCompanyDto,
} from "backend/interfaces/company.interface";
import { faker } from "@faker-js/faker";
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


const CompanyGenerator = async () => {
	for (let i = 0; i < 15; i++)
		await CompanyService.addCompany(generateRandomCompany());
};

export default CompanyGenerator;
