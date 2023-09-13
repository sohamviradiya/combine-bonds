"use client";
import Background from "@/components/background";
import { StockCard } from "@/components/stock/stock-card";
import { useAuth } from "@/context/session";
import { Button, Container, FormControl, Paper, Skeleton, Slider, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import background from "public/transaction-background.svg";
import { fetchPosition, postTransaction } from "./action";
import { useEffect, useMemo, useState } from "react";
import DataTypography from "@/components/data-typography";

export default function TransactionPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [info, setInfo] = useState('Invest carefully!');
    const queryClient = useQueryClient();
    const [transactionAmount, setTransactionAmount] = useState(0);
    const { session } = useAuth();
    const [valueError, setValueError] = useState('');

    useEffect(() => {
        if (!session)
            router.push('/login');
    }, [session, router]);

    const { error: fetchError, isLoading: isFetching, data: position, isError } = useQuery({
        queryKey: ['transaction', {
            stock: params.id,
            portfolio: session.portfolio
        }],
        queryFn: () => fetchPosition({ stock: params.id, portfolio: session.portfolio }),
        enabled: !!session
    });

    const { error: mutateError, isLoading: isMutating, mutate, isSuccess: isMutateSuccess, isError: isMutateError } = useMutation({
        mutationKey: ['transaction', { stock: params.id, session_id: session._id, amount: transactionAmount }],
        mutationFn: () => postTransaction({ stock: params.id, session_id: session._id, amount: transactionAmount }),
        onSuccess: () => {
            queryClient.invalidateQueries(['transaction', {
                stock: params.id,
                portfolio: session.portfolio
            }]);
            queryClient.invalidateQueries(['portfolio', {
                id: session.portfolio
            }]);
        },
    });

    useEffect(() => {
        setInfo('Invest carefully!');
        if (isMutateSuccess)
            setInfo('Transaction success!');
        if (isMutateError)
            setInfo('Transaction failed!');
        if (isFetching)
            setInfo('Fetching...');
        if (isMutating)
            setInfo('Transaction...');
    }, [isMutateSuccess, isMutateError, isFetching, isMutating]);

    useEffect(() => {
        if (!position) return;
        if (transactionAmount < -position.amount) {
            setValueError('Cannot sell more than you have!');
            return;
        }
        if (transactionAmount > position.balance) {
            setValueError('Cannot spend more than you have!');
            return;
        }
        setValueError('');
    }, [transactionAmount, position]);

    console.log(position);
    const marks = useMemo(() => {
        if (!position) return [{
            value: 0,
            label: `0%`,
        }];
        const amount = position.amount;
        const balance = position.balance;
        const marks = [] as { value: number, label: string }[];
        const balance_divisions = Math.min(10, balance / 100);
        const amount_divisions = Math.min(11 - balance_divisions, amount / position.price);

        for (let i = -amount_divisions; i < 0; i++) {
            marks.push({
                value: i * amount / amount_divisions,
                label: `${(-i * 100) / amount_divisions}%`,
            });
        }
        marks.push({
            value: 0,
            label: `0%`,
        });
        for (let i = 1; i <= balance_divisions; i++) {
            marks.push({
                value: i * balance / balance_divisions,
                label: `${(i * 100) / balance_divisions}%`,
            });
        }
        console.log(marks);
        return marks;
    }, [position]);

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', padding: '2rem', minHeight: "100vh", textAlign: "center" }}>
            <Background src={background} />
            <Typography variant="h2">Transaction</Typography>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignSelf: 'center', width: "80%", padding: "2rem" }}>
                <StockCard id={params.id} />
                {isFetching && <Skeleton variant="rectangular" width="100%" height={700} />}
                <FormControl sx={{ width: '100%', backgroundColor: "secondary.dark", padding: "1rem", color: "white" }}>
                    {position &&
                        <>
                            <Slider
                                defaultValue={0}
                                getAriaValueText={(value) => `${value}`}
                                step={1}
                                marks={marks}
                                min={-position.amount}
                                max={position.balance - 1}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `${value}`}
                                value={transactionAmount}
                                onChange={(e, value) => setTransactionAmount(Number(value))}
                            />
                            <TextField inputProps={{ inputMode: 'numeric', min: -position.amount, max: position.balance, step: 0.1 }} onChange={(e) => setTransactionAmount(Number(e.target.value))} value={transactionAmount} />
                            <Button variant="contained" onClick={() => mutate()} disabled={!!valueError.length}> Transact </Button >
                        </>
                    }

                </FormControl>
                <DataTypography value={transactionAmount} unit="$" />
                <DataTypography value={(position?.price && transactionAmount / position?.price) || 0} unit="Shares" sign />
                <Typography variant="h3" color="error.main">{isError && (fetchError as { message: string }).message}</Typography>
                <Typography variant="h3" color="error.main">{valueError}</Typography>
                <Typography variant="h3" color="error.main">{isMutateError && (mutateError as { message: string }).message}</Typography>
                <Typography variant="h3" color="info.main"> {info} </Typography>
            </Paper>
        </Container>
    );
};