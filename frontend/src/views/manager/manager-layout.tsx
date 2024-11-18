import SideBar from "../../components/side-bar";
import AdminHeader from "../../components/admin-header";
import { Outlet, useLocation } from "react-router-dom";

const ManagerLayout = () => {
  const currentRoute = useLocation();
 
  return (
    <div className="flex h-screen">
      <div className=" w-60">
        <SideBar />
      </div>
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 overflow-auto">
        <AdminHeader
          headerText={currentRoute.pathname.split('/')[2].toUpperCase()}
        />
         <Outlet /> 
      </div>
    </div>
  );
};

export default ManagerLayout;
