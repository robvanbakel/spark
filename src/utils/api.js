import store from '@/store';
import auth from '@/firebase';

const request = async (method, path, body) => {
  if (method !== 'GET' && store.getters['auth/user'].demo) return null;

  const idToken = await auth.currentUser.getIdToken();

  return fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/${path}`, {
    method,
    headers: {
      authorization: idToken,
      'Content-Type': 'application/json',
    },
    body,
  });
};

const get = async (...args) => {
  const res = await request('GET', ...args);
  return res.json();
};

const post = (...args) => request('POST', ...args);

const patch = (...args) => request('PATCH', ...args);

const destroy = (...args) => request('DELETE', ...args);

export default {
  get,
  post,
  patch,
  destroy,
};
