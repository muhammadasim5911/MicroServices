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

export function getFilterKeys(companyId) {
  const url = `${endpoints.filters.filterTypes}${companyId}`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      response: data.data,
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
  //   const data = { params };
  const res = await axios.post(url, params);

  /**
   * Work in local
   */

  return res.data;
}
// ----------------------------------------------------------------------
