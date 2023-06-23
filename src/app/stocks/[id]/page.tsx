"use client";

import { Metadata } from "next";
import { CompanyDetailsComponent } from "@/components/CompanyDetails";
import { StockDetailsComponent } from "@/components/StockDetails";
import { StockPriceChartComponent } from "@/components/StockChart";
import { useEffect, useState } from "react";
import { StockInterfaceWithId } from "types/stock.interface";
import { CompanyInterfaceWithId } from "types/company.interface";
import { useRouter } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
     const [stock, setStock] = useState<StockInterfaceWithId | null>(null);
     const [company, setCompany] = useState<CompanyInterfaceWithId | null>(null);
     const router = useRouter();
     useEffect(() => {
          console.log(params.id);
          fetch(`http://${window.location.host}/api/stock/${params.id}`).then((res) => res.json())
               .then((res) => {
                    setStock(res.stock);
               }
               ).catch((err) => console.log(err)).then(() => {
                    if (stock) {
                         fetch(`http://${window.location.host}/api/company/${stock.company}`).then((res) => res.json())
                              .then((res) => {
                                   setCompany(res.company);
                              }
                              ).catch((err) => console.log(err));
                    }
               });
          
     }, [params]);

     return (<>
          {(false) ? (<h1> Page Not Mounted </h1>)
               : (<>
                    {
                         (stock && company) ? (<main style={{
                              backgroundColor: 'black',
                              color: 'black',
                              fontSize: '2rem',
                              display: 'flex',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'space-around'
                         }}>
                              <div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen', textOverflow: 'clip', }}>
                                   <h1>{stock.name}</h1>
                                   <h2>{stock.class}</h2>
                                   {localStorage.getItem("id") ? (<button onClick={() => router.push(`/transaction/?id=${stock._id}&name=${stock.name}`)}>Purchase</button>) : (<></>)}
                              </div>
                              <div style={{ width: '100vw', display: 'flex', gap: '1rem', flexDirection: 'row', justifyContent: 'space-between', padding: "2rem" }}>
                                   <StockDetailsComponent stock={stock} />
                                   <CompanyDetailsComponent company={company} />
                              </div>
                              <StockPriceChartComponent timeline={stock.timeline} />
                         </main>)
                              : (<div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen', textOverflow: 'clip', }}>
                                   <h1>LOADING...</h1>
                              </div>)
                    }</>)
          }
     </>)
};

export const metadata: Metadata = {
     title: "Stock Details",
};