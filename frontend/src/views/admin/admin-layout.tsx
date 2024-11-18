import AdminHeader from "../../components/admin-header";
import { Outlet, useLocation } from "react-router-dom";
import SideBarAdmin from "./side-bar-admin";

const AdminLayout = () => {
  const currentRoute = useLocation();

  return (
    <div className="flex h-screen">
      <div className=" w-60">
        <SideBarAdmin />
      </div>
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 overflow-auto">
        <AdminHeader
          headerText={currentRoute.pathname.split("/")[2].toUpperCase()}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
