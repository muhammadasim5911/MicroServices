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
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { z as zod } from 'zod';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema definitions
const emailSchema = zod
  .string()
  .min(1, { message: 'Email is required!' })
  .email({ message: 'Email must be a valid email address!' });

const domainSchema = zod
  .string()
  .min(1, { message: 'Domain is required!' })
  .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, {
    message: 'Please enter a valid domain (e.g., venndii.com)',
  });

const ConfigurationSchema = zod
  .object({
    value: zod.string().min(1, 'This field is required'),
    verificationType: zod.enum(['email', 'domain']),
  })
  .refine(
    (data) => {
      if (data.verificationType === 'email') {
        return emailSchema.safeParse(data.value).success;
      } else {
        return domainSchema.safeParse(data.value).success;
      }
    },
    {
      message: 'Invalid input for the selected verification type',
      path: ['value'],
    }
  );

export function PostListView() {
  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ConfigurationSchema),
    defaultValues: {
      value: '',
      verificationType: 'email',
    },
  });

  const verificationType = watch('verificationType');

  const onSubmit = handleSubmit(async (data) => {
    // Handle form submission
    console.log(data);
    handleCloseDialog();
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Configurations"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Configurations' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EmptyContent
        title="No Configuration found"
        showButton={true}
        onButtonPress={handleOpenDialog}
        filled
        buttonLabel="Create new Configuration"
        sx={{ py: 10, marginTop: 1 }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Configuration</DialogTitle>
        <DialogContent>
          <TextField
            {...register('value')}
            autoFocus
            margin="dense"
            id="value"
            label={verificationType === 'email' ? 'Email Address' : 'Domain'}
            type={verificationType === 'email' ? 'email' : 'text'}
            fullWidth
            variant="outlined"
            error={!!errors.value}
            helperText={errors.value?.message}
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Verification Type</FormLabel>
            <RadioGroup
              {...register('verificationType')}
              aria-label="verification-type"
              name="verificationType"
            >
              <FormControlLabel value="email" control={<Radio />} label="Verify Email" />
              <FormControlLabel value="domain" control={<Radio />} label="Verify Domain" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={onSubmit} variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
