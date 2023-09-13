"use client";

import { useAuth } from "@/context/session";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Github from "@mui/icons-material/GitHub";

export default function Template({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { session, logout } = useAuth();

    return (
        <>
            <header style={{ backgroundColor: 'black', color: 'white', padding: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                <Link href="/">
                    <Typography variant="h3" color="secondary.light">Combine-Bonds</Typography>
                </Link>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', width: "40%" }}>
                    <Button><Link href="/stock"><Typography variant="h5" color="info.main">Browse</Typography></Link></Button>
                    <Button><Link href="/analysis"><Typography variant="h5" color="info.main">News</Typography></Link></Button>

                    {session?.portfolio ? (
                        <>
                            <Button><Link href="/portfolio"><Typography variant="h5" color="info.main">Profile</Typography></Link></Button>
                            <Button onClick={() => logout().then(() => router.push('/'))}><Typography variant="h5" color="info.main">Logout</Typography></Button>
                        </>
                    ) : (
                        <>
                            <Button><Link href="/register"><Typography variant="h5" color="info.main">Register</Typography></Link></Button>
                            <Button><Link href="/login"><Typography variant="h5" color="info.main">Login</Typography></Link></Button>
                        </>
                    )}
                </Box>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', padding: '2rem', minHeight: "100vh", textAlign: "center" }}>
                {children}
            </main>

            <footer style={{ backgroundColor: 'black', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: "2rem", alignItems: "center" }}>
                <Typography variant="h4">&copy; {new Date().getFullYear()} Soham Viradiya</Typography>
                <Link target="_blank" href="https://github.com/sohamviradiya/combine-bonds/"><Github sx={{ fontSize: "3rem" }} /></Link>
            </footer>
        </>
    );
}
