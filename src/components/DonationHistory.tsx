import * as React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {useState, useEffect} from 'react'
import axiosInstance from '@/utils/axiosInstance';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { format } from "date-fns";
interface Donation {
  sl: number;
  id: number;
  donorName: string;
  amount: number;
  message: string;
  amountToTaka: string
  donationDate: string;
  mobileNumber: string;
}

const paginationModel = { page: 0, pageSize: 5 };
export default function DonationHistory() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  
  useEffect(() => {
    fetchDonations();
  }, []);
  console.log(currentDonation)
  const fetchDonations = async () => {
    try {
      let sl = 1;
      const {data} = await axiosInstance.get('/donations');
      setRows(data.map((donation:Donation) =>{
        return {
          ...donation,
          sl: sl++,
          amountToTaka: `৳ ${donation.amount}`,
          donationDate: format(new Date(donation.donationDate), 'dd MMM yyyy')
        }
      }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 401) {
      }
    }
  };
  // OPEN EDIT DIALOG
  const handleEdit = (donation: Donation) => {
    setCurrentDonation(donation);
    setEditDialogOpen(true);
  };

  // CLOSE EDIT DIALOG
  const handleClose = () => {
    setCurrentDonation(null);
    setEditDialogOpen(false);
  };

  // SAVE CHANGES
  const handleSave = async () => {
    if (!currentDonation) return;

    try {
      const { id, donorName, amount, message } = currentDonation;
      console.log(typeof amount)
      await axiosInstance.patch(`/donations/${id}`, {
        donorName,
        amount,
        message,
      });
      alert('Donation updated successfully');
      await fetchDonations();
      handleClose();
    } catch (error) {
      console.error(error);
      alert('Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to soft-delete this donation?')) return;
    try {
      await axiosInstance.delete(`/donations/${id}`);
      setRows((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };
  const columns: GridColDef[] = [
    { field: 'sl', headerName: 'SL', width: 70 },
    { field: 'donorName', headerName: 'Donor Name', flex: 1 },
    { field: 'amountToTaka', headerName: 'Amount', width: 100 },
    { field: 'mobileNumber', headerName: 'Mobile Number', flex: 1},
    { field: 'donationDate', headerName: 'Donation Date', flex: 1},
    { field: 'message', headerName: 'Message', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const donation = params.row as Donation;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="info"
              onClick={() => handleEdit(donation)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(donation.id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];
  
  return (
    <Box >
      <Paper sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={rows as GridRowsProp}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15]}
          sx={{ border: 0 }}
        />
      </Paper>
      
      <Dialog open={editDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Donation</DialogTitle>
      <DialogContent>
        {currentDonation && (
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography component='p' color='red' align='center' >
                Must be update donation amount
            </Typography>
            <TextField
              label="Donor Name"
              value={currentDonation.donorName}
              onChange={(e) =>
                setCurrentDonation({ ...currentDonation, donorName: e.target.value })
              }
            />
            <TextField
              label="Amount"
              type="number"
              value={currentDonation.amount}
              onChange={(e) =>
                setCurrentDonation({
                  ...currentDonation,
                  amount: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Message"
              multiline
              minRows={2}
              value={currentDonation.message}
              onChange={(e) =>
                setCurrentDonation({
                  ...currentDonation,
                  message: e.target.value,
                })
              }
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
}
