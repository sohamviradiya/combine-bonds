"use client";

import MaskContext from "@/context/mask";
import QueryContext from "@/context/query";
import ThemeContext from "@/context/theme";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <ThemeContext>
            <MaskContext>
                <QueryContext>
                    {children}
                </QueryContext>
            </MaskContext >
        </ThemeContext>
    )
}