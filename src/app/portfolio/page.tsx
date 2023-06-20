import styles from "./page.module.css";

export default async function Page() {
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
               
          </main>
     );
}
