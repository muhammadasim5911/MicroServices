import { useState } from 'react';
import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { z as zod } from 'zod';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAllConfigurations, verifyDomain } from 'src/actions/configurations';
import DeleteIcon from '@mui/icons-material/Delete'; // Add this import
import RefreshIcon from '@mui/icons-material/Refresh'; // Add this import
import { endpoints } from 'src/utils/axios';
import { mutate } from 'swr';
import { keyframes } from '@emotion/react';
import AddIcon from '@mui/icons-material/Add';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
// Schema definitions
const emailSchema = zod
  .string()
  .min(1, { message: 'Email is required!' })
  .email({ message: 'Invalid email address!' });

const domainSchema = zod
  .string()
  .min(1, { message: 'Domain is required!' })
  .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, {
    message: 'Invalid domain name!',
  });

const ConfigurationSchema = zod
  .object({
    value: zod.string().min(1, 'This field is required'),
    configurationType: zod.enum(['email', 'domain']),
  })
  .superRefine((data, ctx) => {
    if (data.configurationType === 'email') {
      const emailResult = emailSchema.safeParse(data.value);
      if (!emailResult.success) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Invalid email address!',
          path: ['value'],
        });
      }
    } else {
      const domainResult = domainSchema.safeParse(data.value);
      if (!domainResult.success) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Invalid domain name!',
          path: ['value'],
        });
      }
    }
  });

export function PostListView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [configDetails, setConfigDetails] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [error, setError] = useState(null);
  const { allConfigurations } = getAllConfigurations();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(ConfigurationSchema),
    defaultValues: {
      value: '',
      configurationType: 'email',
    },
  });

  const configurationType = watch('configurationType');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null); // Clear any previous errors
    setIsVerifying(true);
    try {
      if (data.configurationType === 'domain') {
        const result = await verifyDomain({ domainName: data.value });
        setVerificationResult(result);
      } else {
        // Handle email verification if needed
        // For now, we'll just simulate a successful email verification
        setVerificationResult({ message: 'Email verification initiated.' });
      }
      setConfigDetails(data);
      handleNext(); // Move to the third step only if there's no error
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setActiveStep(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleVerificationComplete = () => {
    console.log('Verification completed');

    handleRefresh();
    handleCloseDialog();
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    });
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Implement the logic to fetch the latest configurations
      await mutate(endpoints.configurations.configuration);
    } catch (error) {
      console.error('Error refreshing configurations:', error);
      // Optionally, show an error message to the user
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };
  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <CustomBreadcrumbs
          heading="Configurations"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Configurations' }]}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            New Configuration
          </Button>
          <Tooltip title={isRefreshing ? 'Refreshing...' : 'Refresh configurations'}>
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{
                animation: isRefreshing ? `${spin} 1s linear infinite` : 'none',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {allConfigurations?.length === 0 ? (
        <EmptyContent
          title="No Configuration found"
          showButton={true}
          onButtonPress={handleOpenDialog}
          filled
          buttonLabel="New Configuration"
          sx={{ py: 10, marginTop: 1 }}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: '100%' }} aria-label="configuration table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>

                <TableCell align="center">Verified</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allConfigurations?.map((config) => (
                <TableRow key={config.emailDomain}>
                  <TableCell component="th" scope="row">
                    {config.emailDomain}
                  </TableCell>

                  <TableCell align="center">
                    {config.isVerified ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" size="small" onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDialog();
          }
        }}
      >
        <DialogTitle>Create New Configuration</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Submit</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <FormControl fullWidth>
              <FormLabel>Configuration Type</FormLabel>
              <Select
                {...register('configurationType')}
                value={configurationType}
                onChange={(e) => setValue('configurationType', e.target.value)}
              >
                <MenuItem value="email">Email Configuration</MenuItem>
                <MenuItem value="domain">Domain Configuration</MenuItem>
              </Select>
            </FormControl>
          )}

          {activeStep === 1 && (
            <>
              <TextField
                {...register('value')}
                autoFocus
                margin="dense"
                id="value"
                label={configurationType === 'email' ? 'Email Address' : 'Domain'}
                type={configurationType === 'email' ? 'email' : 'text'}
                fullWidth
                variant="outlined"
                error={!!errors.value || !!error}
                helperText={errors.value?.message || error}
              />
              {/* {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )} */}
            </>
          )}

          {activeStep === 2 && configDetails && verificationResult && (
            <>
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="text.primary" fontWeight="bold" gutterBottom>
                  {verificationResult.message}
                </Typography>
              </Box>

              {configDetails.configurationType === 'domain' && verificationResult.data && (
                <>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Name: {verificationResult.data.Name}
                    </Typography>
                    <Tooltip title={copiedField === 'name' ? 'Copied!' : 'Copy to clipboard'}>
                      <IconButton
                        onClick={() => handleCopy(verificationResult.data.Name, 'name')}
                        size="small"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" mb={1}>
                    Type: {verificationResult.data.Type}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Value: {verificationResult.data.Value}
                    </Typography>
                    <Tooltip title={copiedField === 'value' ? 'Copied!' : 'Copy to clipboard'}>
                      <IconButton
                        onClick={() => handleCopy(verificationResult.data.Value, 'value')}
                        size="small"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && activeStep < 2 && <Button onClick={handleBack}>Back</Button>}
          {activeStep === 0 && (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
          {activeStep === 1 && (
            <Button onClick={onSubmit} variant="contained" disabled={isSubmitting || isVerifying}>
              {isVerifying ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          )}
          {activeStep === 2 && (
            <Button onClick={handleVerificationComplete} variant="contained">
              {configDetails.configurationType === 'domain' ? 'I have added' : 'I have verified'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
