'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import DonationReports from '@/components/DonationReports';
import DonationHistory from '@/components/DonationHistory';

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [token, setToken] = useState()
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Paper>
          <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="secondary" textColor="primary" variant="fullWidth">
            <Tab label="Donation Summary" />
            <Tab label="Donation History" />
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <DonationReports />}
          {tabValue === 1 && <DonationHistory />}
        </Box>
      </Box>
    </>
  );
}
