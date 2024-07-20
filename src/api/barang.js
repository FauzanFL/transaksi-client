import axios from 'axios';
import { getCookie } from '../utils/jscookie';

export const getAllBarang = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/barangs`, {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
    withCredentials: true,
  });
  return res;
};
