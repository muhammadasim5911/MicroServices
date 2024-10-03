import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { FileManagerTable } from '../file-manager-table';
import { FileManagerFilters } from '../file-manager-filters';
import { FileManagerGridView } from '../file-manager-grid-view';
import { FileManagerFiltersResult } from '../file-manager-filters-result';
import { FileManagerNewFolderDialog } from '../file-manager-new-folder-dialog';
import { Card, IconButton } from '@mui/material';

// ----------------------------------------------------------------------

export function FileManagerView() {
  const upload = useBoolean();

  const filters = useSetState({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  const [keys, setKeys] = useState([]);
  const generateKey = () => {
    const newKey = {
      id: Date.now(), // Unique ID based on the current timestamp
      publicKey: `public-${Math.random().toString(36).substring(2, 15)}`,
      privateKey: `private-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleString(),
    };
    setKeys((prevKeys) => [...prevKeys, newKey]);
  };
  const handleDeleteKey = (id) => {
    setKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));
  };
  return (
    <>
      <DashboardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">API key</Typography>
          <Button variant="contained" startIcon={<Iconify icon="lock" />} onClick={generateKey}>
            Generate
          </Button>
        </Stack>
        {keys.length > 0 ? (
          keys.map((key) => (
            <Card key={key.id} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Public Key: {key.publicKey}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Private Key: {key.privateKey}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {key.createdAt}
              </Typography>

              <IconButton aria-label="revoke" onClick={() => handleDeleteKey(key.id)}>
                {/* <DeleteIcon /> */}
              </IconButton>
            </Card>
          ))
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              No keys generated
            </Typography>
          </Stack>
        )}
        {/* <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {renderFilters}

          {canReset && renderResults}
        </Stack> */}
        {/* <EmptyContent filled sx={{ py: 10 }} /> */}

        {/* {notFound ? (
        ) : (
          <>
            {view === 'list' ? (
              <FileManagerTable
                table={table}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <FileManagerGridView
                table={table}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
              />
            )}
          </>
        )} */}
      </DashboardContent>

      {/* <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} /> */}

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
