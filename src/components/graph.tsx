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

export default function Graph({ data, title, tickFormatter }: { data: { date: number, value: number }[], title: string, tickFormatter: (value: number) => string }) {
    data = data.sort((a, b) => a.date - b.date);
    const values = data.map((entry) => entry.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const tick = (max - min) / 12;

    return (
        <Container sx={{ position: 'relative', padding: '2rem' }} maxWidth="xl">
            <Typography variant="h2" gutterBottom> {title} </Typography>
            <ResponsiveContainer width="100%" height={700}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} style={{ background: 'black' }} >
                    <XAxis dataKey="date" tick={{ fill: 'white' }} />
                    <YAxis domain={[min - tick, max + tick]} tickCount={12} width={80} tick={{ fill: 'white' }} tickFormatter={tickFormatter} />
                    <CartesianGrid stroke="blue" opacity="0.2" />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'black', color: 'white' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value) => ([`${Number(value).toFixed(2)} $`, 'Value'])}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="red"
                        strokeWidth={5}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    );
}