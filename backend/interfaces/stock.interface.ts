type stockInterface = {
	name: String;
	gross_volume: Number;
	timeline: [
		{
			date: Date;
			market_valuation: Number;
			volume_in_market: Number;
		}
	];
	createdAt: Date;
	company: String;
};


export default stockInterface;
