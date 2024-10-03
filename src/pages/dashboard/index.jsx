import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';

import { CONFIG } from 'src/config-global';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';

import { OverviewAppView } from 'src/sections/overview/app/view';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { label } from 'yet-another-react-lightbox';
import { getAllFilters } from 'src/actions/filters';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };
export const NewTourSchema = zod.object({
  label: zod.string().optional(),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  body: zod.string().min(1, { message: 'Body is required!' }),

  dropdown: zod.string().optional(),
  channel: zod.string().array().min(1, { message: 'Please select atleast one channel!' }),

  values: zod.string().array().optional(),
});

export default function OverviewAppPage() {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { allFilters } = getAllFilters();
  console.log('🚀 ~ OverviewAppPage ~ allFilters:', allFilters.length);

  const [selected, setSelected] = useState();

  const [selectedChannel, setSelectedChannel] = useState();

  const defaultValues = useMemo(
    () => ({
      values: [],
      channel: [],
      label: '',
      dropdown: '',
    }),
    []
  );
  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(NewTourSchema),
  });

  const { watch, reset, setValue, handleSubmit } = methods;
  const formValues = watch();

  const RangeSlider = ({ label, min = 0, max = 100 }) => {
    const [value, setValue] = useState([min, max]);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Box sx={{ width: '100%' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={'20px'}
        >
          <Typography variant="subtitle2">
            {label}: {value[0]} - {value[1]}
          </Typography>
          <LoadingButton
            onClick={() => {
              let valuestoSend = [
                ...selectedGroups,
                {
                  fieldType: 'RANGE_SLIDER',
                  values: `Range Slider (${value[0]} - ${value[1]})`,
                },
              ];

              setSelectedGroups(valuestoSend);
              toast.success('Added successfully!');
            }}
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
          >
            {'Add'}
          </LoadingButton>
        </Box>

        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto" // Show current value while sliding
          min={min}
          max={max}
          // Show start and end labels
        />
      </Box>
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
  });
  const renderDynamicField = (item) => {
    switch (item?.filterType) {
      case 'INPUT':
        return (
          <>
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{item.filterLabel}</Typography>
                <LoadingButton
                  onClick={() => {
                    if (!formValues.label) {
                      toast.error('Please write something first to add!');
                      return;
                    }
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'Manual',
                        values: formValues.label,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                    toast.success('Added successfully!');

                    setValue('label', '');
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Field.Text name="label" placeholder={item?.filterLabel} />
            </Stack>
          </>
        );
      case 'RADIO':
        return (
          <>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={'20px'}
              >
                <Typography variant="subtitle2">{item.filterLabel}</Typography>
                <LoadingButton
                  onClick={() => {
                    if (!selected) {
                      toast.error('Please select atleast one option!');
                      return;
                    }
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'RADIO',
                        values: selected,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                    toast.success('Added successfully!');
                    setSelected(null);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Grid container spacing={2}>
                {item.filterValues.map((option, index) => (
                  <Grid item xs={4} key={option}>
                    <FormControlLabel
                      control={
                        <Radio checked={option === selected} onClick={() => setSelected(option)} />
                      }
                      label={option}
                      sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        );
      case 'DROP_DOWN':
        return (
          <>
            <div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={'20px'}
              >
                <Typography variant="subtitle2">{item.filterLabel}</Typography>
                <LoadingButton
                  onClick={() => {
                    if (!formValues.dropdown) {
                      toast.error('Please select an option!');
                      return;
                    }
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'DROP_DOWN',
                        values: formValues.dropdown,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                    toast.success('Added successfully!');
                    setValue('dropdown', '');
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Field.Autocomplete
                onChange={(event, newValue) => {
                  setValue('dropdown', newValue);
                }}
                name="dropdown"
                value={formValues.dropdown}
                placeholder="Select a value"
                options={item.filterValues}
                getOptionLabel={(option) => option || ''}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, tourGuide) => (
                  <li {...props} key={tourGuide.id}>
                    {tourGuide}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((tourGuide, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      size="small"
                      variant="soft"
                      label={tourGuide}
                    />
                  ))
                }
              />
            </div>
          </>
        );
      case 'CHECK_BOX':
        return (
          <>
            {item.filterValues.length && (
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{item.filterLabel}</Typography>
                  <LoadingButton
                    onClick={() => {
                      if (!formValues.values || formValues.values.length === 0) {
                        toast.error('Please select an option!');
                        return;
                      }
                      let valuestoSend = [
                        ...selectedGroups,
                        {
                          fieldType: 'CHECK_BOX',
                          values: formValues.values,
                        },
                      ];

                      setSelectedGroups(valuestoSend);

                      toast.success('Added successfully!');
                      setValue('values', []);
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    {'Add'}
                  </LoadingButton>
                </Box>
                <Field.MultiCheckbox
                  name="values"
                  options={item.filterValues.map((value) => ({
                    label: value, // The display label
                    value: value, // The actual value
                  }))}
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
                />
              </Stack>
            )}
          </>
        );
      case 'RANGE_SLIDER':
        return (
          <>
            <RangeSlider
              label={item?.filterLabel}
              min={parseInt(item.minvalue)}
              max={parseInt(item.maxvalue)}
            />
          </>
        );
      default:
        return null;
    }
  };
  const renderActions = (
    // <Stack direction="row" alignItems="center" flexWrap="wrap">
    //   <LoadingButton
    //     // type="submit"
    //     onClick={onSubmit}
    //     variant="contained"
    //     size="large"
    //     //  loading={isSubmitting}
    //     sx={{ ml: 2 }}
    //   >
    //     {'Save changes'}
    //   </LoadingButton>
    // </Stack>
    <Stack
      marginBottom={'10%'}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
    >
      <LoadingButton
        onClick={onSubmit}
        type="submit"
        variant="contained"
        size="large"
        sx={{ ml: 2 }}
      >
        Confirm Send
      </LoadingButton>
    </Stack>
  );
  const renderDetails = (
    <Card>
      <CardHeader
        title="Filters"
        subheader="Add filters to add specified group of users..."
        sx={{ mb: 3 }}
      />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {allFilters ? allFilters.map((item) => renderDynamicField(item)) : null}
      </Stack>
    </Card>
  );
  const rendergroups = (
    <Card>
      <CardHeader
        title="Selected groups"
        subheader="Below is the detailed view of selected users..."
        sx={{ mb: 3 }}
      />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {selectedGroups.map((item) => (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography width={'20%'} variant="subtitle2" alignSelf="center">
              {item.values}
            </Typography>

            <Typography variant="subtitle2" alignSelf="center">
              {item.fieldType}
            </Typography>
            <LoadingButton
              onClick={() => {
                const index = selectedGroups.findIndex((res) => res === item);
                if (index !== -1) {
                  selectedGroups.splice(index, 1);
                  setSelectedGroups([...selectedGroups]); // Update state with the modified array
                }
              }}
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
            >
              {'Remove'}
            </LoadingButton>
          </Box>
        ))}
      </Stack>
    </Card>
  );
  const renderChannels = (
    <Card>
      <CardHeader
        title="Select channel"
        // subheader="Below is the detailed view of selected users..."
        sx={{ mb: 3 }}
      />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {['Email', 'Whatsapp', 'Push Notification', 'SMS', 'In app messages'].map(
            (option, index) => (
              <Grid item xs={4} key={option}>
                <FormControlLabel
                  control={
                    <Radio
                      disabled={index != 0}
                      checked={option === selectedChannel}
                      onClick={() => setSelectedChannel(option)}
                    />
                  }
                  label={option}
                  sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
                />
              </Grid>
            )
          )}
        </Grid>
        {/* <Field.MultiCheckbox
          name="channel"
          options={['Email', 'Whatsapp', 'Push Notification', 'SMS', 'In app messages'].map(
            (value) => ({
              label: value, // The display label
              value: value, // The actual value
            })
          )}
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
        /> */}
      </Stack>
    </Card>
  );
  const renderSubject = (
    <Card>
      <CardHeader
        title="Enter content"
        subheader="This will be sent to selected group of users"
        sx={{ mb: 3 }}
      />

      <Divider />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2">Subject</Typography>
        <Field.Text name="subject" placeholder={'Write subject here...'} />
        <Typography variant="subtitle2">Body</Typography>
        <Field.Text
          name="body"
          placeholder="Write subject here..."
          multiline
          rows={4} // Number of initial rows
          sx={{ width: '100%' }} // Initial width
        />
      </Stack>
    </Card>
  );
  return (
    <Form methods={methods} onSubmit={() => {}}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {allFilters ? renderDetails : null}
        {selectedGroups.length ? rendergroups : null}
        {renderChannels}
        {renderSubject}
        {renderActions}
      </Stack>
    </Form>
  );
}
