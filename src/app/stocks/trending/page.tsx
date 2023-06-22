import styles from "src/app/page.module.css";
import { Metadata } from "next";
import StockService from "@/server/services/stock.service";
import StockDetailsComponentFromID from "@/components/StockDetails";
import { CSSProperties, use } from "react";
import { SLOT_DURATION } from "types/market.interface";
import connectDb from "@/server/mongoose.main";

export default function Page() {
     use(connectDb());
     const high_slope_stockIds = use(StockService.getHighSlope(4));
     const high_double_slope_stockIds = use(StockService.getHighDoubleSlope(4));

     return (
          <main className={styles.main}>
               <h1 style={{ padding: '2rem' }}>Top Trending: </h1>
               <div style={box_style()}>
                    {high_slope_stockIds.map((stockId: string) => (
                         <div key={String(stockId)} style={{ margin: "2rem", border: "4px solid black", backgroundColor: "lightblue" }}>
                              <StockDetailsComponentFromID stock_id={String(stockId)} />
                         </div>
                    ))}
               </div>
               <h1 style={{ padding: '2rem' }}>Top Predicted: </h1>
               <div style={box_style()}>
                    {high_double_slope_stockIds.map((stockId: string) => (
                         <div key={String(stockId)} style={{ margin: "2rem", border: "4px solid black", backgroundColor: "lightgrey" }}>
                              <StockDetailsComponentFromID stock_id={String(stockId)} />
                         </div>
                    ))}
               </div>

          </main>
     );
}

const box_style = (): CSSProperties => ({
     width: "100%",
     color: "black",
     fontSize: "2rem",
     display: "flex",
     flexDirection: "row",
     flexWrap: "wrap",
     justifyContent: "space-around",
     gap: "1rem",
});


export const revalidate = SLOT_DURATION * 60;

export const metadata: Metadata = {
     title: "Stocks",
};
