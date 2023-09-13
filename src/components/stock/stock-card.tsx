import { Button, Card, CardActions, CardContent, Skeleton, Typography } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import DataTypography from '@/components/data-typography';
import { fetchStock } from '@/components/stock/action';
import Link from 'next/link';

export function StockCard({ id }: { id: string }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['stock', { id }],
        queryFn: () => fetchStock({ id }),
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="100%" />;
    }

    if (isError) {
        return <Typography variant="h4" color="error.main">Error fetching stock</Typography>;
    }

    return (
        <Card sx={{ minWidth: 300, alignSelf: "center" }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {data.symbol}
                </Typography>
                <Typography variant="h6" >
                    {data.company}
                </Typography>
                <DataTypography value={data.price} unit="$" />
                <DataTypography value={data.slope * 100} unit="%" sign />
            </CardContent>
            <CardActions>
                <Link href={`/stock/${id}`} >
                    <Button> Learn More </Button>
                </Link>
            </CardActions>
        </Card>
    );
};



