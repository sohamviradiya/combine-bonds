import CompanyService from "backend/services/company.service";

const CompanyGenerator = async () => {
	for (let i = 0; i < 15; i++)
		await CompanyService.addCompany(CompanyService.generateRandomCompany());
};

export default CompanyGenerator;
