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
      allConfigurations: data?.data?.emailConfigurations,
    }),
    [data]
  );

  return memoizedValue;
}
export async function verifyDomain(params) {
  const url = endpoints.configurations.domainCreation;

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

export async function verifyEmail(params) {
  const url = endpoints.configurations.emailCreation;

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
