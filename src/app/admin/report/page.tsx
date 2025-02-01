// app/admin/report/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { Box, Grid, Paper, Typography } from '@mui/material';

interface ReportData {
  totalDonations: number;
  totalAmount: number;
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportData>({ totalDonations: 0, totalAmount: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get('/donations/report');
        setReport(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) { 
        if (err.response && err.response.status === 401) {
          router.push('/login');
        }
      }
    };
    fetchReport();
  }, [router]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Donations Report
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Donations
            </Typography>
            <Typography variant="h3" color="primary">
              {report.totalDonations}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h3" color="secondary">
              {report.totalAmount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
