import styles from "src/app/page.module.css";
import { Metadata } from "next";
import CompanyService from "@/server/services/company.service";
import { CompanyDetailsComponentFromID } from "../../components/CompanyDetails";
export default async function Page() {
     const companyIds = await CompanyService.getAll();
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
               {await Promise.all(companyIds.map(async (companyId) => (
                    <div key={companyId} style={{ margin: "2rem", border: "4px solid black", width: '80%' }}>
                         <CompanyDetailsComponentFromID company_id={companyId} />
                    </div>
               )))}
          </main>
     );
}


export const metadata: Metadata = {
     title: "Companies",
};
