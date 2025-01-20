export const KEY_TOKEN = "accessToken";
export const KEY_USER_INFO = "userInfo";
export const KEY_CURRENT_ROOM = "currentRoom";
export const KEY_IO_STREAM_TOKEN = "ioStreamToken"

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const setIoStreamToken = (token) => {
  localStorage.setItem(KEY_IO_STREAM_TOKEN, token);
};

export const getIoStreamToken = () => {
  return localStorage.getItem(KEY_IO_STREAM_TOKEN);
};

export const setUserInfo = (userInfo) => {
  localStorage.setItem(KEY_USER_INFO, userInfo);
};

export const getUserInfo = () => {
  return localStorage.getItem(KEY_USER_INFO);
};

export const setLocalStorageCurrentRoom = (currentRoom) => {
  localStorage.setItem(KEY_CURRENT_ROOM, currentRoom);
};

export const getCurrentRoom = () => {
  return localStorage.getItem(KEY_CURRENT_ROOM);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};
export const removeUserInfo = () => {
  return localStorage.removeItem(KEY_USER_INFO);
};
