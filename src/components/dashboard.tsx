import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/session';

export default function Dashboard() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const { session, logout } = useAuth();

    return (
        <>
            <Button
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Dashboard
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                {session?.portfolio ? (
                    <>
                        <MenuItem><Link href="/profile">Profile</Link></MenuItem>
                        <MenuItem onClick={() => logout().then(() => router.push('/'))}>Logout</MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem><Link href="/register">Register</Link></MenuItem>
                        <MenuItem><Link href="/login">Login</Link></MenuItem>
                    </>
                )}
                <MenuItem onClick={() => setAnchorEl(null)}> Close</MenuItem>
            </Menu>
        </>
    );
}