"use client";
import Link from "next/link";

export function StockLinkComponent({ stock_id, caption }: { stock_id: string, caption:string }) {
     return (
          <div style={{ color: "blue", width: '100%', marginTop: '6px', textAlign: 'center', padding: '8px', backgroundColor: 'whitesmoke' }}
               onMouseOver={(e) => {
                    e.currentTarget.style.color = 'blueviolet';
                    e.currentTarget.style.backgroundColor = 'lightgrey';
               }} onMouseOut={(e) => {
                    e.currentTarget.style.color = 'blue';
                    e.currentTarget.style.backgroundColor = 'whitesmoke';
               }}
          >
               <Link href={`/stocks/${stock_id}`}>View</Link>
          </div>
     );
}