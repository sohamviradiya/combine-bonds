import CompanyService from "backend/services/company.service";

export default async () =>
	await CompanyService.addCompany(CompanyService.generateRandomCompany());
