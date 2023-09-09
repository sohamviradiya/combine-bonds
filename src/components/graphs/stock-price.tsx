import { Container, Typography } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function StockPriceGraph({ data }: { data: { date: number, stock_price: number }[] }) {
    data = data.sort((a, b) => a.date - b.date);
    const values = data.map((entry) => entry.stock_price);
    const min = Math.min(...values) - 5;
    const max = Math.max(...values) + 5;
    return (
        <Container sx={{ position: 'relative', padding: '2rem' }} maxWidth="xl">
            <Typography variant="h2" gutterBottom> Stock Price Timeline </Typography>
            <ResponsiveContainer width="100%" height={700}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} style={{ background: 'black' }} >
                    <XAxis dataKey="date" tick={{ fill: 'white' }} />
                    <YAxis domain={[min, max]} tickCount={12} width={80} tick={{ fill: 'white' }} tickFormatter={(value) => (`${(value).toFixed(2)} $`)} />
                    <CartesianGrid stroke="blue" opacity="0.2" />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'black', color: 'white' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value) => ([`${Number(value).toFixed(2)} $`, 'Value'])}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="stock_price"
                        stroke="red"
                        strokeWidth={5}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    );
}