import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../utils/theme-switcher";
import AppLogo from "./app-logo";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import NotificationIcon from "./notification-icon";
import CartIcon from "./cart-icon";
import { AppContext } from "../context/app-context";
import NotificationPopup from "./notification-icon";
import { BiSupport } from "react-icons/bi";
import { FaShoppingBag } from "react-icons/fa";
import { Notifications } from "../types";
import { useAxios } from "../hooks/fetch-api.hook";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import ChatIcon from "./chat-icon";
import { MdStarRate } from "react-icons/md";
import AddReview from "./rating-modal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentCompany, user, logout, cart, addChatBot } =
    useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { label: "Menus", url: "/client/menus" },
    { label: "My orders", url: "/client/orders" },
    { label: "My reservation", url: "/client/reservations" },
  ];

  const socket = io(process.env.API_URL, {
    transports: ["websocket"],
  });
  const { allnotifications } = useAxios(
    `notifications/${user?.id}`,
    "GET",
    {},
    "allnotifications",
    true
  );
  const { updatenotifVisibilty } = useAxios(
    `notifications/resetvisibility/${user?.id}`,
    "GET",
    {},
    "updatenotifVisibilty",
    false
  );

  const [notif, setNotif] = useState<Notifications[]>([]);

  useEffect(() => {
    if (allnotifications.responseData) {
      setNotif([...allnotifications?.responseData]);
    }
  }, [allnotifications.responseData]);

  useEffect(() => {
    socket.on(`${user?.id}-${currentCompany?.id}`, (newMessage) => {
      setNotif((prevNotif) =>  [newMessage, ...prevNotif]);

    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user?.id, user?.company?.id]);

  const clearNotifications = async () => {
    await updatenotifVisibilty.submitRequest({}, "", false);
  };

  useEffect(() => {
    if (updatenotifVisibilty.responseData) {
      allnotifications.refreshData();
    }
  }, [updatenotifVisibilty.responseData]);

  useEffect(() => {
    if (allnotifications.responseData) {
      setNotif([...allnotifications.responseData]);
    }
  }, [allnotifications.responseData]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="sticky top-0 z-10 flex items-center bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800"
      maxWidth="full"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <div className="text-white">
            <AppLogo bordred={false} />
          </div>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index} isActive={location.pathname === item.url}>
            <Link
              as={RouterLink}
              to={item.url}
              color={location.pathname === item.url ? "primary" : "foreground"}
              className="text-white hover:text-purple-200"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <div className="flex items-center gap-3">
        <NavbarItem>
        <AddReview/>
        </NavbarItem>

          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="text-white"
              onPress={() => {
                navigate("/places");
              }}
            >
              <FaShoppingBag size={27} />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="text-white"
              onPress={() => {
                addChatBot();
              }}
            >
              <BiSupport size={27} />
            </Button>
          </NavbarItem>
          {/* <NavbarItem>
            <ChatIcon size={22} notifs={0} className={"text-white"} />
          </NavbarItem> */}
          
          <NavbarItem>
            <CartIcon size={28} cartNumber={cart?.items?.length || 0} />
          </NavbarItem>
              <NotificationIcon
                clearNotifications={clearNotifications}
                notifications={notif}
                className="text-white"
                iconColor="text-gray-600"
              />
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
        </div>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={`${user?.firstname.charAt(0).toUpperCase()}${user?.lastname
                .charAt(0)
                .toUpperCase()}`}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              as={RouterLink}
              onPress={() => navigate("/client/profile")}
            >
              My Profile
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              as={RouterLink}
              to={item.url}
              color={location.pathname === item.url ? "primary" : "foreground"}
              className="w-full"
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
