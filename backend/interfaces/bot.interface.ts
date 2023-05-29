export enum BOT_CLASS {
	"Safe-investing", // high bundle filling, low bundle expansion, very high trade period
	"Aggressive-investing", // high random investment, low trade period
	"Speculative-investing", // low random investment, high trade period
	"Day-trading", // high bundle expansion, low bundle filling, low trade period
};

type BotInterface = {
     class: BOT_CLASS;
     trade_period: Number; // in slots (1 slot = 15 minute)
     portfolio: String;
     parameters: {
          investment_amount_per_slot: {
               balance_dependence_parameter: Number
               market_sentiment_dependence_parameter: Number
          }
          bundle_expansion: {
               parameter: Number
               high_raise_investment_parameters: {
                    parameter: Number
                    weight_distribution: [
                         Number // sum of weights = 1
                    ]
               }
               lows_rising_investment_parameters: {
                    parameter: Number
                    weight_distribution: [
                         Number // sum of weights = 1
                    ]
               }
               random_investment_parameters: {
                    parameter: Number
                    weight_distribution: [
                         Number // sum of weights = 1
                    ]
               }
          },
          bundle_filling: {
               parameter: Number
               weight_distribution: [
                    Number // sum of weights = 1
               ],
               loss_aversion_parameter: [
                    reference_price: Number,
                    tolerable_relative_loss: Number
               ]
          },
     }
};

export default BotInterface;
