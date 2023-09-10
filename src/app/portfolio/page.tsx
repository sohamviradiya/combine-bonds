"use client";

import { fetchPortfolio } from "./action";
import { Skeleton, Typography } from "@mui/material";
import { useAuth } from "@/context/session";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function PortfolioPage() {
    const { session } = useAuth();

    if (!session?.portfolio) redirect("/login");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['stock', { id: session.portfolio }],
        queryFn: () => fetchPortfolio({ id: session.portfolio }),
        retry: false,
    });


    if (isLoading) return <Skeleton variant="rectangular" width="100%" height={700} />;
    if (isError || !data) return <Typography variant="h2" color="error.main" gutterBottom> Error: Failed to load stock data {JSON.stringify(error)} </Typography>;

    return (
        <></>
    )
};