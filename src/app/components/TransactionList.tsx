import StockModel from "@/server/models/stock.schema";
import { Transaction } from "@/server/types/portfolio.interface";
import { randomUUID } from "crypto";

export default async function TransactionListComponent({ transactions }: { transactions: Transaction[] }) {

     const stock_names = new Map<String, String>();
     const transaction_details = await Promise.all(transactions.map(async (transaction) => {
          if (transaction.class === "STOCK PURCHASE" || transaction.class === "STOCK SALE" || transaction.class === "STOCK DIVIDEND") {
               transaction.stock = (transaction.stock).toString();
               if (!stock_names.get(transaction.stock)) {
                    const stock_name = (await StockModel.findById(transaction.stock).select("name")).name;
                    stock_names.set(transaction.stock, stock_name);
               }
               return {
                    class: transaction.class,
                    stock: stock_names.get(transaction.stock)||"",
                    amount: transaction.amount
               }
          };
          return {
               class: transaction.class,
               amount: transaction.amount
          };

     }));
     return (
          <div style={{ height: '100vh', overflow: 'scroll', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
               {transaction_details.map((transaction) => <TransactionComponent transaction={transaction as Transaction} key={randomUUID()} />)}
          </div>
     );
};


function TransactionComponent({ transaction }: { transaction: Transaction }) {
     return (<div style={{ border: '2px solid green', width: '45%', margin: '0.5rem' }}>
          <h4>{transaction.class}</h4>
          {transaction.class === "STOCK PURCHASE" || transaction.class === "STOCK SALE" || transaction.class === "STOCK DIVIDEND" ?
               <p>Stock: {transaction.stock}</p> : <></>}
          <p>Amount: {transaction.amount.toFixed(2)}$</p>
     </div>);
};
