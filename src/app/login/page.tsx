"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "src/app/page.module.css";

export default function Page() {
     const [{ login_name, login_password }, setLogin] = useState({ login_name: "", login_password: "" });
     const [{ name, password, bio }, setSignUp] = useState({ name: "", password: "", bio: "" });
     const router = useRouter();
     return (<main className={styles.main} >
          <h1> Login </h1>
          <div style={{
               width: "100vw",
               height: "40vh",
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
               <input type="text" name="name" id="name" onChange={(e) => { setLogin({ login_name: e.target.value, login_password }) }} />
               <label style={{ margin: '1rem' }} htmlFor="password">password</label>
               <input type="password" name="password" id="password" onChange={(e) => { setLogin({ login_name, login_password: e.target.value }) }} />
               <button style={{ margin: '1rem', padding: '1rem' }} type="submit" onClick={(e) => {
                    e.preventDefault();
                    fetch(`http://${window.location.host}/api/auth/`
                         , {
                              method: "PUT",
                              body: JSON.stringify({
                                   "name": login_name,
                                   "password": login_password
                              }),
                         }
                    ).then((res) => res.json()).then((res) => {
                         if (res.id) {
                              window && window.localStorage.setItem("id", res.id);
                              router.push(`/portfolio`);
                         }
                         else {
                              alert(`login failed ${res.message || res}`);
                         }
                    });
               }}>
                    <h1>Login</h1> </button>
          </div>
          <div style={{
               width: "100vw",
               height: "40vh",
               backgroundColor: "black",
               color: "white",
               fontSize: "1.5rem",
               flexDirection: "row",
               flexWrap: "wrap",
               justifyContent: "center",
               alignItems: "center",
               gap: "1rem",
          }}>
               <h1> Sign Up </h1>
               <label style={{ margin: '1rem' }} htmlFor="name">name</label>
               <input type="text" name="name" id="name" onChange={(e) => { setSignUp({ name: e.target.value, password: password, bio }) }} />
               <label style={{ margin: '1rem' }} htmlFor="password">password</label>
               <input type="password" name="password" id="password" onChange={(e) => { setSignUp({ name, password: e.target.value, bio }) }} />
               <label style={{ margin: '1rem' }} htmlFor="bio">bio</label>
               <input type="text" name="bio" id="bio" onChange={(e) => { setSignUp({ name: login_name, password, bio: e.target.value }) }} />
               <button style={{ margin: '1rem', padding: '1rem' }} type="submit" onClick={(e) => {
                    e.preventDefault();
                    console.log({ name, password, bio });

                    fetch(`http://${window.location.host}/api/add/`
                         , {
                              method: "POST",
                              body: JSON.stringify({
                                   "name": name,
                                   "password": password,
                                   "bio": bio,
                              }),
                         }
                    ).then((res) => res.json()).then((res) => {
                         if (res.id) {
                              window && window.localStorage.setItem("id", res.id);
                              router.push(`/portfolio`);
                         }
                         else {
                              alert(`sign up failed ${res.message || res}`);
                         }
                    }).catch((err) => {
                         alert(`sign up failed ${err}`);
                    });
               }}>
                    <h1>Sign Up</h1> </button>
          </div>
     </main>);
};
