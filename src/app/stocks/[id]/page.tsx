import StockService from "@/server/services/stock.service";
import { Metadata } from "next";
import { CompanyDetailsComponent } from "@/components/CompanyDetails";
import { StockDetailsComponent } from "@/components/StockDetails";
import { use } from "react";
import { SLOT_DURATION } from "types/market.interface";
import CompanyService from "@/server/services/company.service";
import connectDb from "@/server/mongoose.main";
export default async function Page({ params }: { params: { id: string } }) {
     use(connectDb());
     const stock = await StockService.get(params.id);
     return (
          <main style={{ backgroundColor: 'black', color: 'black', fontSize: '2rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
               <div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen', textOverflow: 'clip', }}>
                    <h1>{stock.name}</h1>
                    <h2>{stock.class}</h2>
               </div>
               <div style={{ width: '100vw', display: 'flex', gap: '1rem', flexDirection: 'row', justifyContent: 'space-between', padding: "2rem" }}>
                    <StockDetailsComponent stock={stock} />
                    <CompanyDetailsComponentFromID company_id={String(stock.company)} />
               </div>
               {/* <ChartComponent timeline={stock.timeline} /> */}
          </main>
     )
};

function CompanyDetailsComponentFromID({ company_id }: { company_id: string; }) {
     const company = use(CompanyService.get(company_id));
     return (<CompanyDetailsComponent company={company} />)
}


export const revalidate = 900;

export const metadata: Metadata = {
     title: "Stock Details",
};
