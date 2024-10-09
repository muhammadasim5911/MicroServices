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

export function getFilterKeys() {
  const url = `${endpoints.filters.filterTypes}`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      filterKeysData: data,
    }),
    [data]
  );

  return memoizedValue;
}

export function getFilterValues(key) {
  const url = `${endpoints.filters.filterValues}?key=${key}`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      filterValues: data,
    }),
    [data]
  );

  return memoizedValue;
}
export function getAllFilters() {
  const url = `${endpoints.filters.filters}/all`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      allFilters: data?.data,
    }),
    [data]
  );

  return memoizedValue;
}

export async function CreateFilter(params) {
  const url = endpoints.filters?.filters;

  /**
   * Work on server
   */
  const res = await axios.post(url, data);

  /**
   * Work in local
   */

  return res.data;
}
export async function getUserCount(fieldType, values) {
  try {
    const response = await axios.post('/company-users/get-filter-count', {
      filters: {
        [fieldType]: Array.isArray(values) ? values : [values],
      },
    });
    return response.data?.data[0]?.filterCount;
  } catch (error) {
    console.error('Error fetching user count:', error);
    toast.error('Failed to fetch user count');
    return null;
  }
}
// ----------------------------------------------------------------------
