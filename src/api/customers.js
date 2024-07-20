import axios from 'axios';
import { getCookie } from '../utils/jscookie';

export const getAllCustomer = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers`, {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
    withCredentials: true,
  });
  return res;
};
