import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PostDetailsSkeleton } from '../post-skeleton';
import { PostDetailsToolbar } from '../post-details-toolbar';

// Dummy data for configurations
const dummyConfigs = [
  { name: 'Abcdd', type: 'TXT', value: 'abc123xyz789', isVerified: true },
  { name: 'xyzabc', type: 'TXT', value: 'dadbydab3773323', isVerified: false },
  { name: 'nnnyudd', type: 'TXT', value: 'sjhdhahdhkjd8d7ad86da', isVerified: true },
];

export function PostDetailsView({ loading, error }) {
  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const handleCopyClick = (value) => {
    navigator.clipboard.writeText(value);
    // You might want to add a toast notification here to inform the user that the value has been copied
  };

  // if (loading) {
  //   return (
  //     <DashboardContent maxWidth={false} disablePadding>
  //       <PostDetailsSkeleton />
  //     </DashboardContent>
  //   );
  // }

  // if (error) {
  //   return (
  //     <DashboardContent maxWidth={false}>
  //       <EmptyContent
  //         filled
  //         title="No configuration found!"
  //         action={
  //           <Button
  //             component={RouterLink}
  //             href={paths.dashboard.post.root}
  //             startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
  //             sx={{ mt: 3 }}
  //           >
  //             Add new
  //           </Button>
  //         }
  //         sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
  //       />
  //     </DashboardContent>
  //   );
  // }

  return (
    <DashboardContent maxWidth={false} disablePadding>
      {/* <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backLink={paths.dashboard.post.root}
          editLink={paths.dashboard.post.edit('configurations')}
          liveLink={paths.post.details('configurations')}
          publish={`${publish}`}
          onChangePublish={handleChangePublish}
          publishOptions={[]}
        />
      </Container> */}

      <Stack
        sx={{
          pb: 5,
          mx: 'auto',
          width: '100%',
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Configurations
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: '100%' }} aria-label="configuration table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell align="center">Verified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyConfigs.map((config) => (
                <TableRow key={config.name}>
                  <TableCell component="th" scope="row">
                    {config.name}
                  </TableCell>
                  <TableCell>{config.type}</TableCell>
                  <TableCell>
                    {config.value}
                    <IconButton
                      onClick={() => handleCopyClick(config.value)}
                      size="small"
                      sx={{ ml: 1 }} // Added left margin
                    >
                      <Iconify icon="mdi:content-copy" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    {config.isVerified ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DashboardContent>
  );
}
