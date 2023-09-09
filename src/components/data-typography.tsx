import { Typography } from '@mui/material';

export default function DataTypography({ value, unit, sign }: { value: number; unit: string; sign?: boolean }) {
    return (<Typography variant="h5" sx={{
        color: value >= 0 ? 'success.main' : 'error.main',
    }}>{` ${sign ? (value >= 0 ? '+' : '-') : ''} `} {Math.abs(value).toFixed(2)} {unit}</Typography>);
};
