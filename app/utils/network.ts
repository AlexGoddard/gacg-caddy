export const del = async (path: string, args: object) => {
  return window.api.invoke(`${path}/delete`, args);
};

export const get = async (path: string, args?: object) => {
  return window.api.invoke(`${path}/get`, args);
};

export const post = async (path: string, args: object) => {
  return window.api.invoke(`${path}/post`, args);
};

export const put = async (path: string, args: object) => {
  return window.api.invoke(`${path}/put`, args);
};
