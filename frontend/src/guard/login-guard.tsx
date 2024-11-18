import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/app-context";

interface LoginGuardProps {
  children: JSX.Element;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
  const { isAuthenticated, role } = useContext(AppContext);

  if (isAuthenticated) {
    if(role =="MANAGER"){
      return <Navigate to="/manager/dashboard" replace />;
    }
    if(role === "CLIENT"){
      return <Navigate to="/client" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children; 
};

export default LoginGuard;
