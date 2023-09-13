import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/session';

export default function Dashboard() {
    const router = useRouter();
    const { session, logout } = useAuth();

    return (
        <>
            {session?.portfolio ?
                (<>
                    <Button><Link href="/profile">Profile</Link></Button>
                    <Button onClick={() => logout().then(() => router.push('/'))}>Logout</Button>
                </>) :
                (
                    <>
                        <Button><Link href="/register">Register</Link></Button>
                        <Button><Link href="/login">Login</Link></Button>
                    </>
                )
            }
        </>
    );
}