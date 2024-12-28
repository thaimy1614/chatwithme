import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { getUserInfo } from "../services/localStorageService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(getUserInfo());
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
