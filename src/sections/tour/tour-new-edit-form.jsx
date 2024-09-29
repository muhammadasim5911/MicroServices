import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useState } from 'react';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { filterKeys, filterOptions } from 'src/_mock/_filters';
import { TOUR_SERVICE_OPTIONS } from 'src/_mock';
import { Checkbox } from '@mui/material';
import axios from 'axios';

// Define your schema with optional filterKey
export const NewTourSchema = zod
  .object({
    label: zod.string().min(1, { message: 'Label is required!' }),
    filterType: zod.string().min(1, { message: 'Filter type is required!' }),
    filterKey: zod.string().optional(), // Make filterKey optional
    minvalue: zod.string().optional(), // Make filterKey optional
    maxvalue: zod.string().optional(), // Make filterKey optional

    values: zod.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    const { filterType, filterKey, minvalue, maxvalue, values } = data;
    if (filterKey && !values.length) {
      ctx.addIssue({
        path: ['values'], // Path to the issue
        code: zod.ZodIssueCode.custom,
        message: 'Must have at least 1 item!',
      });
    }
    if (
      (filterType === 'Radio Buttons' ||
        filterType === 'DropDown' ||
        filterType === 'Check Boxes') &&
      !filterKey
    ) {
      ctx.addIssue({
        path: ['filterKey'], // Path to the issue
        code: zod.ZodIssueCode.custom,
        message: 'Filter key is required when filter type is radio, dropdown, or checkbox!',
      });
    } else if (filterType === 'Range Slider' && !minvalue) {
      ctx.addIssue({
        path: ['minvalue'], // Path to the issue
        code: zod.ZodIssueCode.custom,
        message: 'Min value is required',
      });
    } else if (filterType === 'Range Slider' && !maxvalue) {
      ctx.addIssue({
        path: ['maxvalue'], // Path to the issue
        code: zod.ZodIssueCode.custom,
        message: 'max value is required',
      });
    }

    if (filterType === 'Range Slider' && minvalue && maxvalue) {
      const min = parseFloat(minvalue);
      const max = parseFloat(maxvalue);

      if (!isNaN(min) && !isNaN(max) && min >= max) {
        ctx.addIssue({
          path: ['minvalue'], // Indicate that the issue is with the minvalue
          code: zod.ZodIssueCode.custom,
          message: 'Min value should be smaller than max value',
        });
      }
    }
  });

export function TourNewEditForm({ currentTour }) {
  const defaultValues = useMemo(
    () => ({
      values: currentTour?.values || [],
    }),
    [currentTour]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(NewTourSchema),
  });

  const [valuesData, setValuesData] = useState([]);

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data);

    const url = 'https://66f4701877b5e889709983c0.mockapi.io/api/v1/filterkey'; // Replace with your API endpoint

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
      });

      console.log('Success:', response.data);
      toast.success('Create success!');

      reset({
        filterKey: '',
        filterType: '',
        label: '',
        minvalue: '',
        maxvalue: '',
        values: [],
      }); // Resets the form fields to default values
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  });

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Label</Typography>
          <Field.Text name="label" placeholder="Write down label for filter" />
        </Stack>
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Filter type
          </Typography>
          <Field.Autocomplete
            value={values.filterType}
            onChange={(event, newValue) => {
              setValue('filterType', newValue.name);
              setValue('filterKey', undefined);
              setValue('values', []);
            }}
            name="filterType"
            placeholder="Select filter type"
            options={filterOptions}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.name === value}
            renderOption={(props, tourGuide) => (
              <li {...props} key={tourGuide.id}>
                {tourGuide.name}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((tourGuide, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={tourGuide.id}
                  size="small"
                  variant="soft"
                  label={tourGuide.name}
                />
              ))
            }
          />
        </div>
        {values.filterType == 'Range Slider' && (
          <Stack direction="row" spacing={3}>
            <Stack spacing={1.5} flex={1}>
              <Typography variant="subtitle2">Min value</Typography>
              <Field.Text
                name="minvalue"
                placeholder="Enter min value"
                onKeyPress={(event) => {
                  // Prevent non-numeric input
                  if (!/^[0-9]*$/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Stack>
            <Stack spacing={1.5} flex={1}>
              <Typography variant="subtitle2">Max value</Typography>
              <Field.Text
                onKeyPress={(event) => {
                  // Prevent non-numeric input
                  if (!/^[0-9]*$/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                name="maxvalue"
                placeholder="Enter max value"
              />
            </Stack>
          </Stack>
        )}
        {/* Conditionally render filterKey based on filterType */}
        {(values.filterType === 'Radio Buttons' ||
          values.filterType === 'DropDown' ||
          values.filterType === 'Check Boxes') && (
          <div>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Filter key
            </Typography>
            <Field.Autocomplete
              onChange={(event, newValue) => {
                setValue('filterKey', newValue.name);
                setValue('values', []);

                setValuesData(newValue.data);
              }}
              name="filterKey"
              placeholder="Select filter key"
              options={filterKeys}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.name === value}
              renderOption={(props, tourGuide) => (
                <li {...props} key={tourGuide.id}>
                  {tourGuide.name}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((tourGuide, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={tourGuide.id}
                    size="small"
                    variant="soft"
                    label={tourGuide.name}
                  />
                ))
              }
            />
          </div>
        )}

        {values?.filterKey ? (
          <Stack spacing={1}>
            <Typography variant="subtitle2">Values</Typography>

            <Field.MultiCheckbox
              name="values"
              options={valuesData}
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
            />
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentTour ? 'Create filter' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderActions}
      </Stack>
    </Form>
  );
}
