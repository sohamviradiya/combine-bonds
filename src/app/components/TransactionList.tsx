import StockModel from "@/server/models/stock.schema";
import { Transaction } from "@/server/types/portfolio.interface";
import { randomUUID } from "crypto";

export default async function TransactionListComponent({ transactions }: { transactions: Transaction[] }) {

     const stock_names = new Map<String, String>();
     for (let transaction of transactions) {

          if (transaction.class === "STOCK PURCHASE" || transaction.class === "STOCK SALE" || transaction.class === "STOCK DIVIDEND") {
               transaction.stock = String(transaction.stock);
               if (!stock_names.has(transaction.stock)) {
                    const stock_name = (await StockModel.findById(transaction.stock).select("name")).name;
                    stock_names.set(transaction.stock, stock_name);
               }
               transaction.stock = stock_names.get(transaction.stock) as string;
          }
     }
     return (
          <>
               {transactions.map((transaction) => <TransactionComponent transaction={transaction} key={randomUUID()} />)}
          </>
     );
};


function TransactionComponent({ transaction }: { transaction: Transaction }) {
     return (<>
          <h3>Type: {transaction.class}</h3>
          {transaction.class === "STOCK PURCHASE" || transaction.class === "STOCK SALE" || transaction.class === "STOCK DIVIDEND" ?
               <p>Stock: {transaction.stock}</p> : <></>}
          <p>Amount: {transaction.amount}$</p>
     </>);
};
