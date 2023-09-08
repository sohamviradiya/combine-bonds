"use client";

import ThemeContext from "./theme";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <ThemeContext>
            {children}
        </ThemeContext>
    )
}