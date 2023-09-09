"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData } from "./action";
import { Skeleton, Typography, Card, Accordion, AccordionSummary, AccordionDetails, CardContent, Container } from "@mui/material";
import CompanyData from "./company";
import StockPriceGraph from "@/components/graphs/stock-price";
import DataTypography from "@/components/data-typography";
import background from "public/stock-background.svg";
import Background from "@/components/background";
import { ValuePoint } from "@/types/stock.interface";

function Stock({ params }: { params: { id: string } }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['stock', params.id],
        queryFn: () => fetchStockData({ id: params.id }),
        retry: false,
    });

    if (isLoading) return <Skeleton variant="rectangular" width="100%" height={700} />;
    if (isError) return <Typography variant="h2" color="error.main" gutterBottom> Error: Failed to load stock data </Typography>;

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            <Background src={background} />
            <Card>
                <CardContent>
                    <Typography variant="h2">{data.symbol}</Typography>
                    <DataTypography value={data.last_value_point.price * 100} label="Price" unit="$" />
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h4">Gross Volume: {data.gross_volume}</Typography>
                    <Typography variant="h4">Issued: {data.issued.toLocaleDateString()}</Typography>
                    <DataTypography value={data.slope} label="Slope" unit="%" sign />
                    <DataTypography value={data.last_value_point.dividend * 100} label="Divided" unit="$" />
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <DataTypography value={data.market_valuation} label="Market Capitalization" unit="M $" />
                    <DataTypography value={data.double_slope * 100} label="Double Slope" unit="%" sign />
                    <DataTypography value={data.fall_since_peak * 100} label="Fall Since Peak" unit="%" sign />
                    <DataTypography value={data.rise_since_trough * 100} label="Rise Since Trough" unit="%" sign />
                </CardContent>
            </Card>


            <Accordion>
                <AccordionSummary>
                    <Typography variant="h5">Company Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CompanyData {...data.company} />
                </AccordionDetails>
            </Accordion>

            <StockPriceGraph data={data.timeline.map((value_point: ValuePoint) => ({
                date: value_point.date,
                stock_price: value_point.price,
            }))} />
        </Container>
    );
}

export default Stock;