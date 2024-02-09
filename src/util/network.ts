import isElectron from 'is-electron';

export const del = async (path: string, args: object) => {
  if (isElectron()) {
    return window.ipcRenderer.invoke(`${path}/delete`, args);
  } else {
    throw new Error('Web requests not yet implemented');
  }
};

export const get = async (path: string, args?: object) => {
  if (isElectron()) {
    return window.ipcRenderer.invoke(`${path}/get`, args);
  } else {
    throw new Error('Web requests not yet implemented');
  }
};

export const post = async (path: string, args: object) => {
  if (isElectron()) {
    return window.ipcRenderer.invoke(`${path}/post`, args);
  } else {
    throw new Error('Web requests not yet implemented');
  }
};

export const put = async (path: string, args: object) => {
  if (isElectron()) {
    return window.ipcRenderer.invoke(`${path}/put`, args);
  } else {
    throw new Error('Web requests not yet implemented');
  }
};
