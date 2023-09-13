"use client";
import Background from "@/components/background";
import { Container, Typography, TextField, Button, FormControl, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import background from "public/register-background.svg";
import { registerPortfolio } from "@/app/register/action";
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: '', password: '', bio: '' });
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('Remember your credentials!');

    useEffect(() => {
        if (user.password != confirm) {
            setError('Passwords do not match');
            setInfo('');
        }
        else {
            setError('');
            setInfo('Remember your credentials!');
        }
    }, [user.password, confirm]);

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', padding: '2rem', minHeight: "100vh", textAlign: "center" }}>
            <Background src={background} />
            <Typography variant="h1">Register </Typography>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignSelf: 'center', width: "60%", padding: "2rem" }} elevation={3}>
                <FormControl>
                    <TextField label="Username" name="name" type="name" required value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ height: '5rem', color: "whitesmoke" }} />
                    <TextField label="Password" name="password" type="password" required value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ height: '5rem', color: "whitesmoke" }} />
                    <TextField label="Confirm Password" name="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ height: '5rem', color: "whitesmoke" }} />
                    <TextField multiline label="Bio" name="bio" type="text" required value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ minHeight: '5rem', color: "whitesmoke", marginBottom: "1rem" }} />
                    <Button type="submit" variant="contained" color="primary" onClick={(e) => {
                        setInfo('');
                        e.preventDefault();
                        registerPortfolio(user).then(({ portfolio, message }) => {
                            if (portfolio)
                                router.push('/login');
                            else {
                                setInfo('try again');
                                setError(message);
                            }
                        });
                    }} disabled={confirm != user.password}> Register </Button>
                </FormControl>
                <Typography variant="h3" color="error.main">{error} </Typography>
                <Typography variant="h3" color="info.main"> {info} </Typography>
            </Paper>
        </Container >
    );
}
