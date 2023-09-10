"use client";

import { StockCard } from "@/components/stock/stock-card";
import { Grid, Typography } from "@mui/material";
import { InfiniteData } from "@tanstack/react-query";

export default function StockList({ data }: { data: InfiniteData<string[]> }) {
    const list = data.pages.reduce((acc, val) => acc.concat(val), []);
    if (list.length === 0) return (<Typography variant="h2" color="warning.main">No results found</Typography>);
    return (
        <Grid container spacing={2}>
            {list.map((stock, index) => (
                <Grid item xs={12} sm={6} md={3} key={stock}>
                    <StockCard id={stock} />
                </Grid>
            ))}
        </Grid>
    );
};
