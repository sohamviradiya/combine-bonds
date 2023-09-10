"use client";
import DataTypography from '@/components/data-typography';
import { StockInterface } from '@/types/stock.interface';
import { Typography, Card, CardContent, Paper, Grid } from '@mui/material';

const CompanyInfoRow = ({ label, value }: { label: string, value: string }) => {
    return (
        <Card elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <CardContent>
                <Typography variant="h5">
                    {label ? `${label} : ` : ''} {value}
                </Typography>
            </CardContent>
        </Card>
    );
};

const CompanyDetails = ({ data }: { data: StockInterface['company'] }) => {
    return (
        <Grid container spacing={2} lg={24} md={24} sm={24} xs={24}>
            <Grid item xs={24} sm={12} md={3}>
                <CompanyInfoRow label="" value={data.name} />
            </Grid>
            <Grid item xs={24} sm={12} md={8}>
                <CompanyInfoRow label="Field" value={data.field} />
            </Grid>
            <Grid item xs={24} sm={12} md={6}>
                <CompanyInfoRow label="Form" value={data.form} />
            </Grid>
            <Grid item xs={24} sm={12} md={5}>
                {data.assets && (
                    <CompanyInfoRow value={`${(data.assets / 10 ** 6).toFixed(0)} M $`} label="Assets" />
                )}
            </Grid>

            <Grid item xs={24}>
                {data.description && (
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <CardContent>
                            <Typography variant="h5">
                                Description: {data.description}
                            </Typography>
                        </CardContent>
                    </Paper>
                )}
            </Grid>

            <Grid item xs={24} sm={12} md={4}>
                {data.established && (
                    <CompanyInfoRow
                        label="Established"
                        value={data.established ? data.established.toLocaleDateString() : ''}
                    />
                )}
            </Grid>
            {data.employees && (
                <Grid item xs={24} sm={12} md={3}>
                    <CompanyInfoRow
                        label="Employees"
                        value={`${data.employees}`}
                    />
                </Grid>
            )}
            <Grid item xs={24} sm={12} md={5}>
                {data.headquarters && (
                    <CompanyInfoRow
                        label="Location"
                        value={data.headquarters ? data.headquarters : ''}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default CompanyDetails;
