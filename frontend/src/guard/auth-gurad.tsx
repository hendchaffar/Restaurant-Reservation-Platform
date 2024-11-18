import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/app-context";

interface AuthGuardProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, role } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated) {
    if (role && !allowedRoles.includes(role)) {
      if (isAuthenticated) {
        if(role =="MANAGER"){
          return <Navigate to="/manager/dashboard" replace />;
        }
        if(role === "CLIENT"){
          return <Navigate to="/client" replace />;
        }
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
  }

  return children;
};

export default AuthGuard;
