import { Typography } from '@mui/material';

export default function DataTypography({ value, unit, sign, label }: { value: number; unit: string; sign?: boolean, label?: string }) {
    return (<Typography variant="h5" sx={{
        color: value >= 0 ? 'success.main' : 'error.main',
    }}>
        <Typography variant="h5" component="span" color="white">{label ? `${label} : ` : ''}</Typography>
        {` ${sign ? (value >= 0 ? '+' : '-') : ''} `} {Math.abs(value).toFixed(2)} {unit}
    </Typography>);
};
