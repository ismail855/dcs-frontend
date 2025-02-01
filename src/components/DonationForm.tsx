// components/DonationForm.tsx
'use client';

import { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
export default function DonationForm() {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!donorName.trim()) {
      newErrors.donorName = 'Donor name is required';
    }

    if (!amount || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{11}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 11 digits';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axiosInstance.post('/donations', {
        donorName,
        amount: Number(amount),
        message,
        mobileNumber,
      });
      alert('Donation successful! Thank you.');
      setDonorName('');
      setAmount(0);
      setMessage('');
      setMobileNumber('');
      setErrors({});
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
        // Handle server-side validation errors
        const serverErrors = err.response.data.message;
        const formattedErrors: { [key: string]: string } = {};
        serverErrors.forEach((msg: string) => {
          if (msg.includes('donorName')) formattedErrors.donorName = msg;
          if (msg.includes('amount')) formattedErrors.amount = msg;
          if (msg.includes('message')) formattedErrors.message = msg;
          if (msg.includes('mobileNumber')) formattedErrors.mobileNumber = msg;
        });
        setErrors(formattedErrors);
      } else {
        alert('Failed to process donation');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Donor Name"
          variant="outlined"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          required
          error={!!errors.donorName}
          helperText={errors.donorName}
        />
        <TextField
          label="Amount (USD)"
          type="number"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          inputProps={{ min: 1 }}
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <TextField
          label="Mobile Number"
          variant="outlined"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          error={!!errors.mobileNumber}
          helperText={errors.mobileNumber}
          inputProps={{ maxLength: 11 }}
        />
        <TextField
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={3}
          required
          error={!!errors.message}
          helperText={errors.message}
        />            
        <Button type="submit" variant="contained" color="secondary" size="large">
          Donate
        </Button>
      </Stack>
    </form>
  );
}
