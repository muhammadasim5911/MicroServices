import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { keyBy } from 'src/utils/helper';
import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function getAllUsers() {
  const url = `${endpoints.user.getAllUsers}`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      allUsers: data,
    }),
    [data]
  );

  return memoizedValue;
}
export async function uploadCSVFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${endpoints.user.uploadCSV}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Mutate the SWR cache to re-fetch the users after upload

    return response.data;
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    throw error;
  }
}
