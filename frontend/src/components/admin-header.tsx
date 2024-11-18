import { useContext, useEffect, useState } from "react";
import { ThemeSwitcher } from "../utils/theme-switcher";
import NotificationIcon from "./notification-icon";
import { io } from "socket.io-client";
import { AppContext } from "../context/app-context";
import { Notifications } from "../types";
import { useAxios } from "../hooks/fetch-api.hook";
import ChatIcon from "./chat-icon";

const AdminHeader = (props: { headerText: string }) => {
  const { headerText } = props;
  const { user } = useContext(AppContext);
  const socket = io(process.env.API_URL ,{
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
    socket.on(`${user?.id}-${user?.company?.id}`, (newMessage) => {
      console.log("new (with company ID)", newMessage);
      setNotif((prevNotif) => [newMessage, ...prevNotif]);
    });
  
    socket.on(`${user?.id}`, (newMessage) => {
      console.log("new (user ID only)", newMessage);
      setNotif((prevNotif) => [newMessage, ...prevNotif]);
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
    <>
      <div className="flex justify-between items-center mb-12">
        <div className="text-[#3c4858] dark:text-white text-xl font-semibold cursor-pointer">
          {headerText}
        </div>
        <div className="flex gap-2">
          <ThemeSwitcher />
          <NotificationIcon
            clearNotifications={clearNotifications}
            notifications={notif}
            className={"dark:text-white text-gray-600 "}
            iconColor="text-gray-600"
          />
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
