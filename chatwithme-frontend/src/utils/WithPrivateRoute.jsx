import { Navigate } from "react-router-dom";
import { getUserInfo } from "../services/localStorageService";

const WithPrivateRoute = ({ children }) => {
  const currentUser = JSON.parse(getUserInfo());

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default WithPrivateRoute;
