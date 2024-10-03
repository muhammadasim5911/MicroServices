import { useState, useEffect, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { toast } from 'src/components/snackbar';
import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { uploadCSVFile } from 'src/actions/users';

// ----------------------------------------------------------------------

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Upload files',
  ...other
}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      await uploadCSVFile(files[0]);
      onClose();
      toast.success('Uploaded Successfully!');
    } catch (error) {
      console.error('Error uploading CSV file:', error);
      toast.error('Failed to upload file. Please try again.');
    }
  };

  const handleRemoveFile = (inputFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={files.length === 0}
        >
          Upload
        </Button>

        {files.length > 0 && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
