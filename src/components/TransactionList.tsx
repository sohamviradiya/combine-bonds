"use client";
import { use } from "react";
import { Transaction } from "types/portfolio.interface";
import { randomUUID } from "crypto";
import { useState, useEffect } from "react";
let k = 0;
export default function TransactionListComponent({ transactions }: { transactions: Transaction[] }) {

     const [transaction_details, setTransactionDetails] = useState<Transaction[]>([]);

     useEffect(() => {
          const stock_names = new Map<String, String>();
          Promise.all(transactions.map(async (transaction) => {
               if (transaction.class === "STOCK PURCHASE" || transaction.class === "STOCK SALE" || transaction.class === "STOCK DIVIDEND") {
                    transaction.stock = (transaction.stock).toString();
                    if (!stock_names.get(transaction.stock)) {
                         const stock_name = await (fetch(`${window.location.host}/api/stock/${String(transaction.stock)}`)
                              .then((res) => res.json())
                              .then((res) => res.name));
                         stock_names.set(transaction.stock, stock_name);
                    }
                    return {
                         class: transaction.class,
                         stock: stock_names.get(transaction.stock) || "",
                         amount: transaction.amount,
                         date: transaction.date
                    } as Transaction;
               }
               return {
                    class: transaction.class,
                    amount: transaction.amount,
                    date: transaction.date
               } as Transaction;
          })).then((res: Transaction[]) => setTransactionDetails(res.reverse()));
     }, [transactions]);
     return (
          <div style={{ height: '100vh', overflow: 'scroll', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
               {transaction_details.map((transaction) => <TransactionComponent transaction={transaction as Transaction} key={k++} />)}
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
