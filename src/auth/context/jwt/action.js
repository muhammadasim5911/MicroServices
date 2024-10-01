import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ emailAddress, password }) => {
  try {
    const params = { emailAddress, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { token } = res.data.data;
    console.log('🚀 ~ signInWithPassword ~ res.data;:', res.data);

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ emailAddress, password, firstName, lastName, company }) => {
  const params = {
    emailAddress,
    password,
    firstName,
    lastName,
    company: {
      name: company,
    },
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
