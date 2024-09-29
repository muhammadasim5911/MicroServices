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

import { OverviewAppView } from 'src/sections/overview/app/view';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };
export const NewTourSchema = zod.object({
  label: zod.string().min(1, { message: 'Label is required!' }),
  dropdown: zod.string().min(1, { message: 'please select dropdown!' }),

  values: zod.string().array().optional(),
});

export default function OverviewAppPage() {
  const [filters, setFilters] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [selected, setSelected] = useState();
  const [selectedChannel, setSelectedChannel] = useState();

  const defaultValues = useMemo(
    () => ({
      values: [],
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

  useEffect(() => {
    async function fetchData() {
      const url = 'https://66f4701877b5e889709983c0.mockapi.io/api/v1/filterkey'; // Replace with your API endpoint
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json', // Specify the content type
          },
        });
        setFilters(response.data);
      } catch (error) {
        console.log('Success:', error.data);
      } // ...
    }
    fetchData();
  }, []);
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
                  fieldType: 'Range Slider',
                  values: `Range Slider (${value[0]} - ${value[1]})`,
                },
              ];

              setSelectedGroups(valuestoSend);
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
  const renderDynamicField = (item) => {
    switch (item?.filterType) {
      case 'Input':
        return (
          <>
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{item.label}</Typography>
                <LoadingButton
                  onClick={() => {
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'Manual',
                        values: formValues.label,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                  }}
                  onSubmit={() => {}}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Field.Text name="label" placeholder={item?.label} />
            </Stack>
          </>
        );
      case 'Radio Buttons':
        return (
          <>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={'20px'}
              >
                <Typography variant="subtitle2">{item.label}</Typography>
                <LoadingButton
                  onClick={() => {
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'Radio Button',
                        values: selected,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Grid container spacing={2}>
                {item.values.map((option, index) => (
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
      case 'DropDown':
        return (
          <>
            <div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={'20px'}
              >
                <Typography variant="subtitle2">{item.label}</Typography>
                <LoadingButton
                  onClick={() => {
                    console.log('valuess', formValues);
                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: 'dropdown',
                        values: formValues.dropdown,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
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
                placeholder="Select a value"
                options={item.values}
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
      case 'Check Boxes':
        return (
          <>
            {item.values.length && (
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{item.label}</Typography>
                  <LoadingButton
                    onClick={() => {
                      let valuestoSend = [
                        ...selectedGroups,
                        {
                          fieldType: 'CheckBox',
                          values: formValues.values,
                        },
                      ];

                      setSelectedGroups(valuestoSend);
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
                  options={item.values.map((value) => ({
                    label: value, // The display label
                    value: value, // The actual value
                  }))}
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
                />
              </Stack>
            )}
          </>
        );
      case 'Range Slider':
        return (
          <>
            <RangeSlider
              label={item?.label}
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
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        //  loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {'Save changes'}
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
        {filters ? filters.map((item) => renderDynamicField(item)) : null}
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
            <Typography variant="subtitle2">{item.values}</Typography>

            <Typography variant="subtitle2">{item.fieldType}</Typography>
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
        <Box>
          <Grid container spacing={2}>
            {['Email', 'Whatsapp', 'Push', 'Sms', 'In app'].map((option, index) => (
              <Grid item xs={4} key={option}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={option === selectedChannel}
                      onClick={() => setSelectedChannel(option)}
                    />
                  }
                  label={option}
                  sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Card>
  );
  return (
    <Form methods={methods} onSubmit={() => {}}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {selectedGroups.length ? rendergroups : null}
        {renderChannels}

        {/* {renderActions} */}
      </Stack>
    </Form>
  );
}
