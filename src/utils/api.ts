import auth from "@/firebase";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const request = async (method: Method, path: string, body?: string) => {
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken) throw new Error();

  return fetch(`${import.meta.env.VITE_ADMIN_HOST || ""}/admin/${path}`, {
    method,
    headers: {
      authorization: idToken,
      "Content-Type": "application/json",
    },
    body,
  });
};

const get = async (path: string, body?: string) => {
  const res = await request("GET", path, body);
  return res?.json();
};

const post = (path: string, body?: string) => request("POST", path, body);

const patch = (path: string, body?: string) => request("PATCH", path, body);

const destroy = (path: string, body?: string) => request("DELETE", path, body);

export default {
  get,
  post,
  patch,
  destroy,
};
