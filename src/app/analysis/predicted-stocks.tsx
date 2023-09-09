import { Grid, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { StockCard } from "../../components/stock/stock-card";
import { fetchPredictedStocks } from "./action";

export default function PredictedStocksList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['predicted-stocks'],
        queryFn: fetchPredictedStocks,
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60vh" />;
    }

    if (isError) {
        return <Typography variant="h4" color="error.main">Error fetching predicted stocks</Typography>;
    }
    return (
        <Grid container spacing={2}>
            {data.map((stock, index) => (
                <Grid item xs={12} sm={6} md={3} key={stock}>
                    <StockCard id={stock} />
                </Grid>
            ))}
        </Grid>
    )
};

