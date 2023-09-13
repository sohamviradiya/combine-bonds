"use client";

import { fetchPortfolio } from "./action";
import { Card, CardContent, CardHeader, Skeleton, Typography } from "@mui/material";
import { useAuth } from "@/context/session";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Graph from "@/components/graph";
import DataTypography from "@/components/data-typography";

export default function PortfolioPage() {
    const { session } = useAuth();
    const router = useRouter();

    if (!session?.portfolio) router.push('/login');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['portfolio', { id: session.portfolio }],
        queryFn: () => fetchPortfolio({ id: session.portfolio }),
        retry: false,
        enabled: !!session?.portfolio,
    });


    if (isLoading) return <Skeleton variant="rectangular" width="100%" height={700} />;
    if (isError || !data) return <Typography variant="h2" color="error.main" gutterBottom> Error: Failed to load stock data {JSON.stringify(error)} </Typography>;

    const net_worth = data.timeline[data.timeline.length - 1].value;

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h2">{data.user?.name}</Typography>
                    <Typography variant="h4">{data.user?.bio || " "}</Typography>
                    <DataTypography value={data.balance} label="Balance" unit="$" />
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <DataTypography value={net_worth} label="Net Worth" unit="$"  />
                    <DataTypography value={net_worth - data.balance} label="Total Investment" unit="M $" />
                    <DataTypography value={data.timeline.length > 1 ? (net_worth - data.timeline[data.timeline.length - 2].value) : 0} label="Last Change" unit="$" sign />
                </CardContent>
            </Card>

            <Graph data={data.timeline.map((entry) => ({ date: entry.date, value: entry.value }))} title="Portfolio Net Worth Timeline" tickFormatter={(value) => (`${(value/1000).toFixed(2)} K $`)} />
        </>
    )
};