import styles from "src/app/page.module.css";
import { Metadata } from "next";
import StockService from "@/server/services/stock.service";
import StockDetailsComponentFromID from "@/components/StockDetails";
import Link from "next/link";
import { SLOT_DURATION } from "types/market.interface";
import connectDb from "@/server/mongoose.main";

export default async function Page() {
     const stockIds = await StockService.getAll();
     stockIds.sort((a, b) => (a[a.length - 1] > b[b.length - 1] ? 1 : -1));
     return (
          <main
               style={{
                    backgroundColor: "black",
                    color: "black",
                    fontSize: "1.5rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
               }}>
               <div style={{ width: "100vw", textAlign: "center", backgroundColor: "lightgreen", display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", flexWrap: 'wrap' }}>
                    <h1>Stocks</h1>
                    <Link href="/stocks/trending">
                         Top Trending
                    </Link>
               </div>
               <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", flexWrap: 'wrap' }}>
                    {stockIds.map((stockId) => (
                         <div key={stockId} style={{ padding: "0.1rem", border: "2px solid black", background: "yellow", margin: "2rem" }}>
                              <StockDetailsComponentFromID stock_id={stockId} />
                         </div>
                    ))}
               </div>
          </main>
     );
}

export const revalidate = SLOT_DURATION * 60;


export const metadata: Metadata = {
     title: "Stocks",
};
