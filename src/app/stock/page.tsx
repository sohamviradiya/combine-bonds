"use client";

import { useEffect, useState } from "react";
import { Container, TextField, Typography, Paper, Button, Skeleton } from "@mui/material";
import { fetchStocksByQuery } from "./action";
import { useInfiniteQuery } from "@tanstack/react-query";
import Background from "@/components/background";
import background from "/public/browser-background.svg";
import StockList from "./stock-list";

export default function StockBrowser() {
    const [query, setQuery] = useState(" ");
    useEffect(() => {
        setQuery("");
    }, []);

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading, isError, } = useInfiniteQuery({
        queryKey: ['stocks', { query }],
        queryFn: ({ pageParam }) => fetchStocksByQuery({ query, page: pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === 8 ? pages.length : false;
        },
    });

    return (
        <Container
            maxWidth="xl"
            sx={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                padding: '16px',
            }}
        >
            <Background src={background} />
            <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
                <TextField
                    label="Search Stocks"
                    variant="filled"
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                    InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                    sx={{ height: '5rem', color: "whitesmoke" }}
                />
            </Paper>
            <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
                {isLoading && <Skeleton variant="rectangular" height={200} />}
                {isError && <Typography variant="h2" color="error"> Error: {(error as { message: string }).message}</Typography>}
                {isFetching && <Typography variant="h2">Fetching...</Typography>}
                {data && <StockList data={data} />}
            </Paper>
            <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    variant="contained"
                    color="primary"
                >
                    {isFetchingNextPage
                        ? <Typography variant="h5" color="info.main">Loading more...</Typography>
                        : hasNextPage
                            ? <Typography variant="h5">Load More</Typography>
                            : <Typography variant="h5">Nothing more to load</Typography>
                    }
                </Button>
            </Paper>
        </Container >
    );
}
