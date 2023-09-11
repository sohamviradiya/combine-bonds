import Background from "@/components/background";
import { StockCard } from "@/components/stock/stock-card";
import { useAuth } from "@/context/session";
import { Button, Container, FormControl, Paper, Skeleton, Slide, Slider, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import background from "public/transaction-background.svg";
import { fetchPosition, postTransaction } from "./action";
import { useEffect, useMemo, useState } from "react";

export default function TransactionPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [info, setInfo] = useState('Invest carefully!');
    const [transactionAmount, setTransactionAmount] = useState(0);
    const { session } = useAuth();

    if (!session)
        router.push('/login');

    const { error: fetchError, isLoading: isFetching, data: position, isError } = useQuery({
        queryKey: ['transaction', {
            stock: params.id,
            portfolio: session.portfolio
        }],
        queryFn: () => fetchPosition({ stock: params.id, portfolio: session.portfolio }),
    });


    const { error: mutateError, isLoading: isMutating, mutate, isSuccess: isMutateSuccess, isError: isMutateError } = useMutation({
        mutationKey: ['transaction', { stock: params.id, session_id: session._id, amount: transactionAmount }],
        mutationFn: () => postTransaction({ stock: params.id, session_id: session._id, amount: transactionAmount }),
        onSuccess: () => {
            router.back();
        }
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

    const marks = useMemo(() => {
        if (!position) return [{
            value: 0,
            label: `0%`,
        }];
        const amount = position.amount;
        const balance = position.balance;
        const marks = [] as { value: number, label: string }[];
        if (amount > 0) {
            for (let i = 4; i > 0; i--) {
                const value = Math.floor(amount * i * 0.25);
                marks.push({
                    value: - value,
                    label: `${Math.floor((value / balance) * 100)}%`,
                });
            }
        }
        if (balance > 0) {
            for (let i = 1; i < 5; i++) {
                const value = Math.floor(balance * i * 0.25);
                marks.push({
                    value,
                    label: `${Math.floor((value / balance) * 100)}%`,
                });
            }
        }
        return marks;
    }, [position]);




    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', padding: '2rem', minHeight: "100vh", textAlign: "center" }}>
            <Background src={background} />
            <Typography variant="h2">Transaction</Typography>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignSelf: 'center', width: "80%", padding: "2rem" }}>
                <StockCard id={params.id} />
                {isFetching && <Skeleton variant="rectangular" width="100%" height={700} />}
                <FormControl sx={{ width: '100%' }}>
                    {position && <Slider
                        aria-label="Small steps"
                        defaultValue={0}
                        getAriaValueText={(value) => `${value}`}
                        step={position.price / 10}
                        marks={marks}
                        min={-position.amount}
                        max={position.balance - 1}
                        valueLabelDisplay="auto"
                        value={transactionAmount}
                        onChange={(e, value) => setTransactionAmount(Number(value))}
                    />}
                    <Typography variant="h4" color="info.main"> {transactionAmount} </Typography>
                    <Button variant="contained" onClick={() => mutate()}>Transaction</Button>
                </FormControl>
                <Typography variant="h3" color="error.main">{isError && JSON.stringify(fetchError)}</Typography>
                <Typography variant="h3" color="error.main">{isMutateError && JSON.stringify(mutateError)}</Typography>
                <Typography variant="h3" color="info.main"> {info} </Typography>
            </Paper>
        </Container>
    );
};