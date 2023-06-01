import CompanyService from "backend/services/company.service";
import {
	COMPANY_FIELDS,
	COMPANY_FORMS,
	createCompanyDto,
} from "backend/interfaces/company.interface";
import { faker } from "@faker-js/faker";

const company_names = [] as string[];

const generateRandomCompany = (): createCompanyDto => {
	let company_name = faker.science.chemicalElement().name;
	while (company_names.includes(company_name))
		company_name = faker.science.chemicalElement().name;
	return {
		name: company_name,
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
	for (let i = 0; i < 25; i++)
		await CompanyService.addCompany(generateRandomCompany());
};

export default CompanyGenerator;
