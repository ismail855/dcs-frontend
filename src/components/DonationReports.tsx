'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

interface DonationReportDto {
  totalDonors: number;
  totalAmount: number;
}

interface DonorInfoDto {
  donorName: string;
  mobileNumber: string;
  totalAmount: number;
}

export default function DonationReports() {
  const [report, setReport] = useState<DonationReportDto | null>(null);
  const [donorInfos, setDonorInfos] = useState<DonorInfoDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [summaryRes, donorsRes] = await Promise.all([
          axiosInstance.get('/donations/report/summary'),
          axiosInstance.get('/donations/report/donors'),
        ]);

        setReport(summaryRes.data);
        setDonorInfos(donorsRes.data);
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a notification)
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Total Donors */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Donors
            </Typography>
            <Typography variant="h4" color="primary">
              {report?.totalDonors}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Donation Amount */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Donation Amount
            </Typography>
            <Typography variant="h4" color="secondary">
              ৳ {report?.totalAmount.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Donor Information Table */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Donor Information
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Donor Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Donation Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donorInfos.map((donor, index) => (
                <TableRow key={index}>
                  <TableCell>{donor.donorName}</TableCell>
                  <TableCell>{donor.mobileNumber}</TableCell>
                  <TableCell>৳ {donor.totalAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
