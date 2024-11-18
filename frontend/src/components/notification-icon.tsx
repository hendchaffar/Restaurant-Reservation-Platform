import { Button } from "@nextui-org/react";
import { IoNotifications } from "react-icons/io5";
import { Notifications } from "../types";
import { useState, useEffect, useRef } from "react";

export default function NotificationPopup({
  iconColor,
  notifications,
  clearNotifications,
  className
}: {
  iconColor: string;
  notifications: Notifications[];
  clearNotifications: () => void;
  className:string
}) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={popupRef}>
      <div className="relative cursor-pointer">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setOpen(!open)}
          className={`${className}`}
        >
          <IoNotifications size={27} />
        </Button>

        {notifications.length > 0 && (
          <div className="absolute -top-11 bottom-0 mt-10 left-5 w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
            <span className="text-white text-xs font-bold">
              {notifications.length}
            </span>
          </div>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-64 p-4 bg-white dark:border-black shadow-lg rounded-lg z-10">
          <h3 className="text-lg text-black font-semibold mb-2">
            Notifications
          </h3>

          {notifications.length > 0 ? (
            <div className="max-h-72 overflow-y-auto space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="border-b p-2 text-black border-gray-200 pb-2 cursor-pointer hover:bg-gray-200"
                >
                  <p className="text-sm">{notif.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}

              <Button
                size="sm"
                color="primary"
                onPress={clearNotifications}
                className="mt-2 w-full"
              >
                Clear All
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
