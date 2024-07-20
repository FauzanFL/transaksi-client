import axios from 'axios';
import { getCookie } from '../utils/jscookie';

export const login = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/login`,
    data,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const isLogin = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/login`, {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
    withCredentials: true,
  });
  return res;
};
