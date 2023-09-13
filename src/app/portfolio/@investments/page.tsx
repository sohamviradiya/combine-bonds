"use client";

import DataTypography from "@/components/data-typography";
import { StockCard } from "@/components/stock/stock-card";
import { useAuth } from "@/context/session";
import { PopulatedInvestment } from "@/types/portfolio.interface";
import { Typography, List, ListItem, Card, CardContent, Grid, Skeleton, Paper, Button, CardActions } from "@mui/material";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchInvestments } from "./action";
import Link from "next/link";


export default function InvestmentListPage() {
    const { session } = useAuth();

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading, isError, } = useInfiniteQuery({
        queryKey: ['investments', { portfolio: session?.portfolio }],
        queryFn: ({ pageParam }) => fetchInvestments({ id: session?.portfolio, page: pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === 4 ? pages.length : false;
        },
        enabled: !!session?.portfolio,
    });
    if (!session) return <Typography variant="h2" color="warning.main">Please login to view your investments</Typography>;
    if (isLoading || isFetching) return <Skeleton variant="rectangular" width="100%" height="100%" />;
    if (isError) return <Typography variant="h2" color="error.main">{JSON.stringify(error)}</Typography>;
    return (
        <>
            <Typography variant="h3" color="primary.main">Investments</Typography>
            <InvestmentList data={data} />
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


function InvestmentList({ data }: { data: InfiniteData<PopulatedInvestment[]> }) {
    const list = data.pages.reduce((acc, val) => acc.concat(val), []);
    if (list.length === 0) return (<Typography variant="h4" color="warning.main">No Investments</Typography>);

    return (
        <>
            <List style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'scroll' }}>
                {list.map((investment, index) => (
                    <ListItem key={index} sx={{ width: 500 }}>
                        <Card>
                            <CardContent>
                                <StockCard id={investment.stock} />
                                <DataTypography value={investment.quantity} label="Quantity" unit="shares" />
                                <DataTypography value={investment.amount} label="Amount" unit="$" />
                                <DataTypography value={investment.change} label="Return" unit="$" sign />
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary">
                                    <Link href={`/stock/${investment.stock}/transaction`}>Sell</Link>
                                </Button>
                            </CardActions>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </>
    );
};
