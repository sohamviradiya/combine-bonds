import { Typography } from '@mui/material';

export default function DataTypography({ value, unit, sign = false, label, precision = 2 }: { value: number; unit: string; sign?: boolean, label?: string, precision?: number }) {
    return (<Typography variant="h5" sx={{
        color: value >= 0 ? 'success.main' : 'error.main',
    }}>
        <Typography variant="h5" component="span" color="white">{label ? `${label} : ` : ''}</Typography>
        {` ${sign ? (value >= 0 ? '+' : '-') : ''} `} {Math.abs(value).toFixed(precision)} {unit}
    </Typography>);
};
