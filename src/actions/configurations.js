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
export function getAllConfigurations() {
  const url = `${endpoints.configurations.configuration}`;

  const { data } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      allConfigurations: data?.data?.emailConfigurations?.domains,
    }),
    [data]
  );

  return memoizedValue;
}
export async function verifyDomain(params) {
  const url = endpoints.configurations.domainVerification;

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
