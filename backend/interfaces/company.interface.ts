export enum COMPANY_FIELDS {
	"Agriculture" = 0,
	"Mining" = 1,
	"Construction" = 2,
	"Manufacturing" = 3,
	"Transportation" = 4,
	"Communication" = 5,
	"Entertainment" = 6,
	"Utilities" = 7,
	"Finance" = 8,
	"Real Estate" = 9,
	"Insurance" = 10,
	"Wholesale" = 11,
	"Retail" = 12,
	"Public Administration" = 13,
}

export enum COMPANY_FORMS {
	"Sole Proprietorship" = 0,
	"Partnership" = 1,
	"Corporation" = 2,
	"Cooperative" = 3,
	"Franchise" = 4,
	"Joint Venture" = 5,
	"Other" = 6,
}

export type companyInterface = {
	name: string;
	field: keyof typeof COMPANY_FIELDS;
	form: keyof typeof COMPANY_FORMS;
	established?: Date;
	description?: string;
	assets: Number;
	stocks: [string];
	headquarters?: string;
	employees: Number;
	market_capitalization: Number;
};

export type companyInterfaceWithId = companyInterface & {
	_id: string;
};

export type createCompanyDto = Omit<
	companyInterface,
	"stocks" | "market_capitalization"
>;

export default companyInterface;