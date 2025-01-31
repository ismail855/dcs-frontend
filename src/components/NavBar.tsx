'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function PublicNavBar() {
  const {logout, user} = useAuth()
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          ASF
        </Typography>
        <div>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>

          {user?.email ? (
            <>
              <Button color="inherit" component={Link} href="/admin">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
