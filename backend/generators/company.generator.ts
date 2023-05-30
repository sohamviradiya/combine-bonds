import CompanyService from "backend/services/company.service";

const CompanyGenerator = async () => {
	return await CompanyService.addCompany(CompanyService.generateRandomCompany());
};

export default CompanyGenerator;