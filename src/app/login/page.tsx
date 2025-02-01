'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import { useAuth } from '@/context/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth()
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Already logged in => redirect
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const {role} = await login(email, password);
      if(role === 'admin') {
        router.push('/admin');
      }else{
        router.push('/user')
      }
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Admin Login
            </Typography>
            <Typography variant="body2">
              Email : admin@gmail.com
            </Typography>
            <Typography variant="body2">
              Password: 1234
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color='secondary'>
              User Login
            </Typography>
            <Typography variant="body2">
              Email : test@gmail.com
            </Typography>
            <Typography variant="body2">
              Password: 1234
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="text"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="secondary" size="large">
                Log In
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
