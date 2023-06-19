import CompanyService from "@/server/services/company.service";
import {
	COMPANY_FIELDS,
	COMPANY_FORMS,
	createCompanyDto,
} from "@/server/types/company.interface";
import { faker } from "@faker-js/faker";

const company_names = [""] as string[];

const NUM_OF_COMPANIES = 20;

const generateCompany = (): createCompanyDto => {
	let company_name = "";
	while (company_names.includes(company_name))
		company_name = faker.science.chemicalElement().name;
	const field = Object.values(COMPANY_FIELDS)[Math.floor(Math.random() * 14)];
	const form = Object.values(COMPANY_FORMS)[Math.floor(Math.random() * 7)];
	const established = faker.date.past();
	const employees = Math.floor(1 + Math.random() * 100000);
	const headquarters = faker.location.street() + ", " + faker.location.city();
	const assets = Math.floor((0.1 + Math.random()) * 100000000);
	return {
		name: company_name,
		field,
		form,
		established,
		description: `${company_name} is a ${field} company established in ${established}. It is a ${form} company. It has ${employees} employees. It is located in ${headquarters}.`,
		assets,
		headquarters,
		employees,
	} as createCompanyDto;
};

const CompanyGenerator = async () => {
	for (let i = 0; i < NUM_OF_COMPANIES; i++) {
		const company = generateCompany();
		await CompanyService.add(company);
	}
};

export default CompanyGenerator;
