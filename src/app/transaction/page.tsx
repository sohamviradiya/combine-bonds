"use client";

import { useRouter } from "next/router";
import { useState } from "react";


export default async function Page({ params }: { params: { id: string } }) {
     const router = useRouter();
     const { id, name } = router.query;
     const [amount, setAmount] = useState(0);

     return (
          <div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen', textOverflow: 'clip', }}>
               <h1>Transaction</h1>
               <label htmlFor="amount">Amount</label>
               <input type="number" id="amount" name="amount" value={amount} step={1} onChange={(e) => { setAmount(Number(e.target.value)); }} />
               <label htmlFor="stock">Stock</label>
               <input type="text" id="stock" name="stock" disabled value={name} />
               <button onClick={async () => {
                    await fetch(`http://${window.location.host}/api/transaction`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json'
                         },
                         body: JSON.stringify({
                              transaction: {
                                   class: "STOCK PURCHASE",
                                   stock: id,
                                   amount: amount,
                              },
                              "id": localStorage.getItem("id")
                         })
                    });
               }
               }>
                    Purchase
               </button>
          </div>
     );
}