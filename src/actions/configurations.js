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

export async function SubmitVerification(params) {
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
