import Cookies from 'js-cookie';

export const addCookie = (name, data) => {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 3);
  Cookies.set(name, data, {
    expires,
    path: '/',
    secure: true,
    sameSite: 'Lax',
  });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};
