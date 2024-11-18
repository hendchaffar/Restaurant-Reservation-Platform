import { Outlet } from "react-router-dom";
import Header from "../../components/header";
import { FaRobot, FaTimes } from "react-icons/fa";
import { Button, Card, Input } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app-context";
import config from "../../bot/config";
import MessageParser from "../../bot/messageParser";
import ActionProvider from "../../bot/actionProvider";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

export default function ClientLayout() {
  const { displayChatBot, removeChatBot } = useContext(AppContext);
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto p-6 bg-white dark:bg-gray-800 relative">
        <Outlet />
        {displayChatBot && (
          <div className="absolute bottom-6 right-6 ">
            <div className="flex flex-col items-end gap-3">
            {showChat && (
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            )}

            <Button
              isIconOnly
              className="bg-gray-500 rounded-full p-2 text-white"
              onClick={toggleChat}
            >
              <FaRobot size={50} />
            </Button>
            </div>
        
          </div>
        )}
      </div>
    </div>
  );
}
