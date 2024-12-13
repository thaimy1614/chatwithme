import { removeToken, removeUserInfo } from "./localStorageService";

export const logOut = () => {
  removeToken();
  removeUserInfo();
};
