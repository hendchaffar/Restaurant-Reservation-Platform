import { Avatar, Button } from "@nextui-org/react";
import { MdEventSeat, MdOutlineTableBar } from "react-icons/md";
import {
  MdDashboard,
  MdOutlineShoppingCart,
  MdPeople,
  MdRestaurantMenu,
  MdOutlineCategory,
} from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { FaBuilding } from "react-icons/fa";
import { AppContext } from "../../context/app-context";
import AppLogo from "../../components/app-logo";

const SideBarAdmin = () => {
  const location = useLocation();
  const { logout, user } = useContext(AppContext);

  const MenuUrl = [
    { label: "Dashboard", url: "/admin/dashboard", icon: <MdDashboard /> },
    { label: "Users", url: "/admin/users", icon: <MdPeople /> },
    { label: "Companies", url: "/admin/companies", icon: <FaBuilding /> },
  ];

  return (
    <div className="overflow-auto flex flex-col gap-6 justify-start h-full p-4 text-white bg-gradient-to-b from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800">
      <AppLogo />

      <Link to="/admin/profile">
        <div
          className="flex items-center gap-2 cursor-pointer mb-6 p-2
        dark:border-gray-700 dark:text-gray-300 dark:hover:bg-purple-500/20 dark:hover:text-purple-300
        hover:bg-white/20 hover:rounded-3xl p-2 transition-all w-fit"
        >
          <div className="p-1">
            <Avatar
              isBordered
              radius="full"
              size="sm"
              name={`${user?.firstname.charAt(0).toUpperCase()}${user?.lastname
                .charAt(0)
                .toUpperCase()}`}
              className="dark:border-2 dark:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-sm">
              {user?.firstname} {user?.lastname}
            </div>
            <div className="font-light text-xs text-white/60">{user?.role}</div>
          </div>
        </div>
      </Link>

      <ul className="space-y-2 flex-grow">
        {MenuUrl.map((m, index) => (
          <li
            key={index}
            className={`rounded p-2 transition-all dark:border-gray-700 dark:text-gray-300 
              ${
                location.pathname === m.url
                  ? "bg-white/20 font-bold dark:bg-purple-500/20 dark:text-purple-300"
                  : "hover:bg-white/20"
              }`}
          >
            <Link to={m.url} className="w-full flex items-center gap-4">
              <span className="text-2xl">{m.icon}</span>
              {m.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="">
        <Button
          onClick={logout}
          className="w-full text-white bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 justify-start gap-2  dark:border-gray-700 dark:text-gray-300 dark:hover:bg-purple-500/20 dark:hover:text-purple-300"
        >
          <IoIosLogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SideBarAdmin;
