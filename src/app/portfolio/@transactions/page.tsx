"use client";

import DataTypography from "@/components/data-typography";
import { StockCard } from "@/components/stock/stock-card";
import { useAuth } from "@/context/session";
import { Transaction } from "@/types/portfolio.interface";
import { Typography, List, ListItem, Card, CardHeader, CardContent, Grid, Skeleton, Paper, Button } from "@mui/material";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchTransactions } from "./action";

export default function TransactionsListPage() {
    const { session } = useAuth();

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading, isError, } = useInfiniteQuery({
        queryKey: ['transactions', { portfolio: session?.portfolio }],
        queryFn: ({ pageParam }) => fetchTransactions({ id: session?.portfolio, page: pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === 4 ? pages.length : false;
        },
        enabled: !!session?.portfolio,
    });
    if (!session) return <Typography variant="h2" color="warning.main">Please login to view your transactions</Typography>;
    if (isLoading || isFetching) return <Skeleton variant="rectangular" width="100%" height="100%" />;
    if (isError) return <Typography variant="h2" color="error.main">{JSON.stringify(error)}</Typography>;

    return (
        <>
            <Typography variant="h3" color="primary.main">Transactions</Typography>
            <TransactionList data={data} />
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
        </>
    );
};

function TransactionList({ data }: { data: InfiniteData<Transaction[]> }) {
    const list = data.pages.reduce((acc, val) => acc.concat(val), []);
    if (list.length === 0) return (<Typography variant="h4" color="warning.main">No Transctions</Typography>);
    return (
        <List style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100vh', overflow: 'scroll' }}>
            {list.map((transaction, index) => (
                <ListItem key={index}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">{transaction.type}</Typography>
                            <DataTypography value={transaction.amount} label="Amount" unit="$" />
                            <DataTypography value={transaction.date} label="Time" unit=" cycles ago" precision={0} />
                            <StockCard id={transaction.stock} />
                        </CardContent>
                    </Card>
                </ListItem>
            ))}
        </List>
    );
};
