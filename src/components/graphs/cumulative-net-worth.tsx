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

export default function NetWorthGraph({ data }: { data: { date: number, cumulative_net_worth: number }[] }) {
    data = data.sort((a, b) => a.date - b.date).map((entry) => ({ ...entry, cumulative_net_worth: entry.cumulative_net_worth / 10 ** 6 }));
    const values = data.map((entry) => entry.cumulative_net_worth);
    const min = Math.min(...values) - 0.1;
    const max = Math.max(...values) + 0.1;
    return (
        <Container sx={{ position: 'relative', padding: '2rem' }} maxWidth="xl">
            <ResponsiveContainer width="100%" height={700}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }} style={{ background: 'black' }} >
                    <XAxis dataKey="date" tick={{ fill: 'white' }} />
                    <YAxis domain={[min, max]} tickCount={12} width={80} tick={{ fill: 'white' }} tickFormatter={(value) => (`${value.toFixed(2)} M`)} />
                    <CartesianGrid stroke="blue" opacity="0.2" />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'black', color: 'white' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value) => ([`${Number(value).toFixed(2)} B`, 'Value'])}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative_net_worth"
                        stroke="red"
                        strokeWidth={5}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    );
}