"use client";

import MaskProvider from "@/context/mask";
import QueryProvider from "@/context/query";
import ThemeContextProvider from "@/context/theme";
import SessionProvider from "@/context/session";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryProvider>
                <ThemeContextProvider>
                    <MaskProvider>
                        <>
                            <Header />
                            {children}
                            <Footer />
                        </>
                    </MaskProvider>
                </ThemeContextProvider>
            </QueryProvider>
        </SessionProvider>
    )
}