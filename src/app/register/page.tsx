"use client";
import Background from "@/components/background";
import { Container, Typography, TextField, Button, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import background from "public/register-background.svg";
import { redirect } from "next/navigation";
import { registerPortfolio } from "./action";

export default function LoginPage() {
    const [user, setUser] = useState({ name: '', password: '', bio: '' });
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user.password != confirm)
            setError('Passwords do not match');
    }, [user.password, confirm]);

    return (
        <Container maxWidth="xl" sx={{ position: "relative" }}>
            <Background src={background} />
            <Typography variant="h4">Login</Typography>
            <FormControl>
                <TextField label="Email" name="email" type="email" required value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <TextField label="Password" name="password" type="password" required value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                <TextField label="Confirm Password" name="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <TextField multiline label="Bio" name="bio" type="text" required value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
                <Button type="submit" variant="contained" color="primary" onClick={(e) => {
                    e.preventDefault();
                    registerPortfolio(user).then(({ portfolio, message }) => {
                        if (portfolio)
                            redirect('/login');
                        else
                            setError(message);
                    });
                }} disabled={confirm != user.password}> Register </Button>
            </FormControl>
            <Typography variant="h3" color="error.main">
                {error}
            </Typography>
        </Container >
    );
}
