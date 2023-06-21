"use client";
export const host = "http://localhost:3000";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "src/app/page.module.css";
export default function Page() {
     const [{ name, password }, setLogin] = useState({ name: "", password: "" });
     const router = useRouter();
     return (<main className={styles.main} >
          <h1> Login </h1>
          <div style={{
               width: "100vw",
               height: "100vh",
               backgroundColor: "black",
               color: "white",
               fontSize: "1.5rem",
               flexDirection: "row",
               flexWrap: "wrap",
               justifyContent: "center",
               alignItems: "center",
               gap: "1rem",
          }}>
               <label style={{ margin: '1rem' }} htmlFor="name">name</label>
               <input type="text" name="name" id="name" onChange={(e) => { setLogin({ name: e.target.value, password }) }} />
               <label style={{ margin: '1rem' }} htmlFor="password">password</label>
               <input type="password" name="password" id="password" onChange={(e) => { setLogin({ name, password: e.target.value }) }} />
               <button style={{ margin: '1rem',padding: '1rem' }}  type="submit" onClick={(e) => {
                    e.preventDefault();
                    fetch(`${host}/api/auth/`
                         , {
                              method: "PUT",
                              body: JSON.stringify({
                                   "name": name,
                                   "password": password
                              }),
                         }
                    ).then((res) => res.json()).then((res) => {
                         if (res.id) {
                              localStorage.setItem("id", res.id);
                              router.push(`/portfolio`);
                         }
                         else {
                              alert(`login failed ${res.message || res}`);
                         }
                    });
               }}>
                    <h1>Login</h1> </button>
          </div>
     </main>);
};