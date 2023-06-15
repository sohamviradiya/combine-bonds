"use client";

import { CompanyInterfaceWithId } from "server/types/company.interface";

export default function CompanyDetailsComponent({ company }: { company: CompanyInterfaceWithId }) {
     console.log(company);
     return (
          <>
               <div style={{ width: '50%', textAlign: 'justify', margin: '1rem', backgroundColor: 'lavender', padding: '1rem' }}>
                    <h3> {company.name}</h3>
                    <h4>Industry: {company.field}</h4>
                    {(company?.established) ? <h5> Established: {(new Date(company?.established)).getFullYear()}</h5> : <></>}
                    <h5>Employees: {company.employees}</h5>
                    <h5>Assets: {company.assets.toLocaleString()} $</h5>
                    <p style={{ fontSize: '1.5rem' }}> Description: {company.description} </p>
               </div >
          </>);
}