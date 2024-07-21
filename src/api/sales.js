import axios from 'axios';
import { getCookie } from '../utils/jscookie';

export const getAllSales = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/sales`, {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
    withCredentials: true,
  });
  return res;
};

export const searchSales = async (keyword) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/sales/search?keyword=${keyword}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const createSales = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/sales/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const deleteSales = async (id) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/sales/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie('token')}`,
      },
      withCredentials: true,
    }
  );
  return res;
};
