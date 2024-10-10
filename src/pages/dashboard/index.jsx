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
  CardContent,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState, useRef } from 'react';
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
import { getAllFilters, getFilterKeys, getUserCount, getVerifiedEmails } from 'src/actions/filters';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { mutate } from 'swr';
import { endpoints } from 'src/utils/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };
export const NewTourSchema = zod.object({
  label: zod.string().optional(),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  body: zod.string().min(1, { message: 'Body is required!' }),

  dropdown: zod.string().optional(),
  channel: zod.string().array().min(1, { message: 'Please select atleast one channel!' }),

  values: zod.string().array().optional(),
  senderEmail: zod.string().email().optional(),
});

const StyledPopper = styled(Popper)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px', // Adjust this value as needed
  zIndex: 1301, // Ensure it appears above other elements
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxHeight: '200px', // Fixed height
  overflow: 'auto', // Enable scrolling
}));

export default function OverviewAppPage() {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { allFilters } = getAllFilters();
  const { verifiedEmails } = getVerifiedEmails();
  const [selected, setSelected] = useState();
  const { filterKeysData } = getFilterKeys();

  const [selectedChannel, setSelectedChannel] = useState();

  const defaultValues = useMemo(
    () => ({
      values: [],
      channel: [],
      label: '',
      dropdown: '',
      senderEmail: '',
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  // Function to handle input changes
  const handleBodyChange = (event) => {
    const value = event.target.value;
    const cursorPosition = event.target.selectionStart;
    const lastHashIndex = value.lastIndexOf('#', cursorPosition);

    if (lastHashIndex !== -1 && cursorPosition > lastHashIndex) {
      const query = value.slice(lastHashIndex + 1, cursorPosition).toLowerCase();
      const filteredSuggestions = filterKeysData?.data?.filter((item) =>
        item.toLowerCase().startsWith(query)
      );
      setSuggestions(filteredSuggestions);
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }

    setValue('body', value);
  };

  // Function to handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const value = watch('body');
    const cursorPosition = inputRef.current.selectionStart;
    const lastHashIndex = value.lastIndexOf('#', cursorPosition);

    const newValue =
      value.slice(0, lastHashIndex + 1) + suggestion + ' ' + value.slice(cursorPosition);

    setValue('body', newValue);
    setAnchorEl(null);
    setSelectedTags([...selectedTags, suggestion]);

    // Set focus back to input and move cursor to end of inserted suggestion
    setTimeout(() => {
      inputRef.current.focus();
      const newCursorPosition = lastHashIndex + suggestion.length + 2;
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleDeleteTag = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

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
            onClick={async () => {
              const count = await getUserCount(item?.filterKey, value);

              let valuestoSend = [
                ...selectedGroups,
                {
                  fieldType: item?.filterKey,
                  values: `Range Slider (${value[0]} - ${value[1]})`,
                  count: count,
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
    const fieldName = `${item.filterType.toLowerCase()}_${item.filterLabel.replace(/\s+/g, '_')}`;

    switch (item?.filterType) {
      case 'INPUT':
        return (
          <>
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">{item.filterLabel}</Typography>
                <LoadingButton
                  onClick={async () => {
                    if (!formValues[fieldName]) {
                      toast.error('Please write something first to add!');
                      return;
                    }

                    const count = await getUserCount(item?.filterKey, formValues[fieldName]);

                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: item?.filterKey,
                        values: formValues[fieldName],
                        count: count,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                    toast.success('Added successfully!');

                    setValue(fieldName, '');
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {'Add'}
                </LoadingButton>
              </Box>
              <Field.Text name={fieldName} placeholder={item?.filterLabel} />
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
                  onClick={async () => {
                    if (!selected) {
                      toast.error('Please select atleast one option!');
                      return;
                    }

                    const count = await getUserCount(item?.filterKey, selected);

                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: item?.filterKey,
                        values: selected,
                        count: count,
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
                  onClick={async () => {
                    if (!formValues[fieldName]) {
                      toast.error('Please select an option!');
                      return;
                    }

                    const count = await getUserCount(item?.filterKey, formValues[fieldName]);

                    let valuestoSend = [
                      ...selectedGroups,
                      {
                        fieldType: item?.filterKey,
                        values: formValues[fieldName],
                        count: count,
                      },
                    ];

                    setSelectedGroups(valuestoSend);
                    toast.success('Added successfully!');
                    setValue(fieldName, '');
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
                  setValue(fieldName, newValue);
                }}
                name={fieldName}
                value={formValues[fieldName]}
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
                PaperComponent={({ children }) => {
                  const theme = useTheme();
                  return (
                    <Paper
                      sx={{
                        background: theme.palette.mode === 'dark' ? '#121212' : 'white', // Dark mode adaptive color
                        color: theme.palette.mode === 'dark' ? 'white' : 'black', // Adaptive text color
                        boxShadow: 'none',
                      }}
                    >
                      {children}
                    </Paper>
                  );
                }}
              />
            </div>
          </>
        );
      case 'CHECK_BOX':
        return (
          <>
            {item?.filterValues?.length && (
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{item.filterLabel}</Typography>
                  <LoadingButton
                    onClick={async () => {
                      if (!formValues[fieldName] || formValues[fieldName].length === 0) {
                        toast.error('Please select an option!');
                        return;
                      }

                      const count = await getUserCount(item?.filterKey, formValues[fieldName]);

                      let valuestoSend = [
                        ...selectedGroups,
                        {
                          fieldType: item?.filterKey,
                          values: formValues[fieldName],
                          count: count,
                        },
                      ];

                      setSelectedGroups(valuestoSend);

                      toast.success('Added successfully!');
                      setValue(fieldName, []);
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    {'Add'}
                  </LoadingButton>
                </Box>
                <Field.MultiCheckbox
                  name={fieldName}
                  options={item.filterValues.map((value) => ({
                    label: value,
                    value: value,
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
    <>
      <CardHeader
        title="Filters"
        subheader="Add filters to add specified group of users..."
        sx={{ mb: 1 }}
      />

      <Divider />
      <Stack spacing={2} sx={{ p: 1 }}>
        {allFilters
          ? allFilters.map((item) => (
              <Card key={item.filterLabel}>
                <CardContent>{renderDynamicField(item)}</CardContent>
              </Card>
            ))
          : null}
      </Stack>
    </>
  );
  const rendergroups = () => {
    const totalUsers = selectedGroups.reduce((total, item) => total + item.count, 0);

    return (
      <Card sx={{ pl: 2 }}>
        <CardHeader
          title="Selected groups"
          subheader="Below is the detailed view of selected users..."
          sx={{ mb: 3 }}
        />

        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Filter Key</TableCell>
                <TableCell align="center">Filter Value</TableCell>
                <TableCell align="center">Count</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedGroups.map((item) => (
                <TableRow key={item.fieldType}>
                  <TableCell align="center">{item.fieldType}</TableCell>
                  <TableCell align="center">{item.values}</TableCell>
                  <TableCell align="center">{item.count}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        const index = selectedGroups.findIndex((res) => res === item);
                        if (index !== -1) {
                          const updatedGroups = [...selectedGroups];
                          updatedGroups.splice(index, 1);
                          setSelectedGroups(updatedGroups);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedGroups.length > 0 && (
          <Box mt={2} p={3}>
            <Divider />
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="body2" color="text.secondary">
                This message will be sent to {totalUsers} users approximately.
              </Typography>
              <Tooltip title="Click for more information">
                <IconButton onClick={handleOpenModal} size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>User Count Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              This message will be sent to a total of {totalUsers} users.
            </Typography>
            <Typography variant="body2" mt={2}>
              Breakdown by filter:
            </Typography>
            <ul>
              {selectedGroups.map((group, index) => (
                <li key={index}>
                  {group.fieldType}: {group.values} - {group.count} users
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  };
  const renderChannels = (
    <Card>
      <CardHeader title="Select channel" sx={{ mb: 3 }} />

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

        {/* New dropdown for selecting the sender's email */}
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
        <Typography variant="subtitle2">From</Typography>
        <Field.Autocomplete
          name="senderEmail"
          placeholder="Select sender's email"
          options={verifiedEmails ? verifiedEmails : []}
          getOptionLabel={(option) => option || ''}
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, email) => (
            <li {...props} key={email}>
              {email}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((email, index) => (
              <Chip
                {...getTagProps({ index })}
                key={index}
                size="small"
                variant="soft"
                label={email}
              />
            ))
          }
          PaperComponent={({ children }) => {
            const theme = useTheme();
            return (
              <Paper
                sx={{
                  background: theme.palette.mode === 'dark' ? '#121212' : 'white', // Dark mode adaptive color
                  color: theme.palette.mode === 'dark' ? 'white' : 'black', // Adaptive text color
                  boxShadow: 'none',
                }}
              >
                {children}
              </Paper>
            );
          }}
        />

        <Typography variant="subtitle2">Subject</Typography>
        <Field.Text name="subject" placeholder={'Write subject here...'} />
        <Typography variant="subtitle2">Body</Typography>
        <Field.Text
          name="body"
          placeholder="Write body here..."
          multiline
          rows={4}
          sx={{ width: '100%' }}
          onChange={handleBodyChange}
          inputRef={inputRef}
        />
        <StyledPopper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8], // Adjust vertical offset as needed
              },
            },
          ]}
        >
          <StyledPaper elevation={3}>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} button onClick={() => handleSuggestionClick(suggestion)}>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        </StyledPopper>
      </Stack>
    </Card>
  );
  return (
    <Form methods={methods} onSubmit={() => {}}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {allFilters ? renderDetails : null}
        {selectedGroups.length ? rendergroups() : null}
        {renderChannels}
        {renderSubject}
        {renderActions}
      </Stack>
    </Form>
  );
}
