'use client';
import { useRef } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import DonationForm from '@/components/DonationForm';

export default function HomePage() {
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          height: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'black',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
        আস-সুন্নাহ ফাউন্ডেশন
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mb: 4, m: 0 }}>
        আস-সুন্নাহ ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান।
        </Typography>
      </Box>

      {/* Donation Form Section */}
      <Box ref={formRef} sx={{px: 2, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Donation Form
            </Typography>
            <DonationForm />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
