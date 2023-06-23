import styles from "src/app/page.module.css";
import { Metadata } from "next";
import CompanyService from "@/server/services/company.service";
import { CompanyDetailsComponent } from "../../components/CompanyDetails";
import { use } from "react";
import connectDb from "@/server/mongoose.main";
export default function Page() {
     use(connectDb());
     const companyIds = use(CompanyService.getAll());
     companyIds.sort((a, b) => (a[a.length - 1] > b[b.length - 1] ? 1 : -1));
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
               {use(Promise.all(companyIds.map(async (companyId) => (
                    <div key={companyId} style={{ margin: "2rem", border: "4px solid black", width: '80%' }}>
                         <CompanyDetailsComponentFromID company_id={companyId} />
                    </div>
               ))))}
          </main>
     );
}


function CompanyDetailsComponentFromID({ company_id }: { company_id: string; }) {
     const company = use(CompanyService.get(company_id));
     return (<CompanyDetailsComponent company={company} />)
}

export const metadata: Metadata = {
     title: "Companies",
};
