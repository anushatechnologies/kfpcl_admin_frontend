import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '@layouts/DashboardLayout';
import { Box } from '@mui/material';

const WithAuthLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', minWidth: 0, overflowX: 'hidden' }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  );
};

export default WithAuthLayout;
