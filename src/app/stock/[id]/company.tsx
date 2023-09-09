import { StockInterfaceWithId } from "@/types/stock.interface";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function CompanyData(company: StockInterfaceWithId['company']) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h3" gutterBottom>
                            {company.name}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">
                            Field: {company.field}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            Form: {company.form}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            {company.established && (
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Established: {company.established.toLocaleDateString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {company.description && (
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Description: {company.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {company.assets && (
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Assets: {company.assets / 10 ** 6} M $
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {company.headquarters && (
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Headquarters: {company.headquarters}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {company.employees && (
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Employees: {company.employees}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
}

