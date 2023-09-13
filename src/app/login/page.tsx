"use client";
import Background from "@/components/background";
import { useAuth } from "@/context/session";
import { Container, Typography, TextField, Button, FormControl, Paper } from "@mui/material";
import { useState } from "react";
import background from "public/login-background.svg";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [user, setUser] = useState({ name: '', password: '' });
    const { login, session } = useAuth();
    const [error, setError] = useState('');
    const [info, setInfo] = useState('Remember your credentials!');
    const router = useRouter();
    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', padding: '2rem', minHeight: "100vh", textAlign: "center" }}>
            <Background src={background} />
            <Typography variant="h1">Login</Typography>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignSelf: 'center', width: "60%", padding: "2rem" }} elevation={3}>
                <FormControl>
                    <TextField
                        label="Username"
                        name="name"
                        type="text"
                        required
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ height: '5rem', color: "whitesmoke" }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        InputProps={{ sx: { fontSize: '1.5rem', color: 'whitesmoke' }, }}
                        sx={{ height: '5rem', color: "whitesmoke" }}
                    />
                    <Button type="submit" variant="contained" color="primary" onClick={(e) => {
                        setInfo('Logging in...');
                        e.preventDefault();
                        login(user).then(({ session, message }) => {
                            if (session)
                                router.push('/portfolio');
                            else {
                                setInfo('Try Logging in again');
                                setError(message);
                            }
                        });
                    }}> Login </Button>
                </FormControl>
                <Typography variant="h3" color="error.main">
                    {error}
                </Typography>
                <Typography variant="h3" color="info.main">
                    {info}
                </Typography>
            </Paper>
        </Container >
    );
}
