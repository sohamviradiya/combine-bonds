import styles from "src/app/page.module.css";
import { Metadata } from "next";
import StockService from "@/server/services/stock.service";
import StockDetailsComponentFromID from "@/app/components/StockDetails";

export default async function Page() {
     const stockIds = await StockService.getAll();
     stockIds.sort((a, b) => (a[a.length - 1] > b[b.length - 1] ? 1 : -1));
     return (
          <main
               className={styles.main}
               style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "2rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
               }}>
               {stockIds.map((stockId) => (
                         <StockDetailsComponentFromID key={stockId} stock_id={stockId} />
               ))}
          </main>
     );
}


export const metadata: Metadata = {
     title: "Stocks",
};
