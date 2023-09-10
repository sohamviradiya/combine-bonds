import Background from "@/components/background";
import { useAuth } from "@/context/session";
import { Container, Typography, TextField, Button, FormControl } from "@mui/material";
import { useState } from "react";
import background from "public/login-background.svg";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const [user, setUser] = useState({ name: '', password: '' });
    const { login, session } = useAuth();
    const [error, setError] = useState('');

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem', 
                position: 'relative',
                padding: '2rem',
            }}
        >
            <Background src={background} />
            <Typography variant="h4">Login</Typography>
            <FormControl>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <Button type="submit" variant="contained" color="primary" onClick={(e) => {
                    e.preventDefault();
                    login(user).then(({ session, message }) => {
                        if (session)
                            redirect('/portfolio');
                        else
                            setError(message);
                    });
                }}> Login </Button>
            </FormControl>
            <Typography variant="h3" color="error.main">
                {error}
            </Typography>
        </Container >
    );
}
