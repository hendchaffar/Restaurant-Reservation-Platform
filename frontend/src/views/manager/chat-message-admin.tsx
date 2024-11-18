import React, { useState, useRef, useContext } from "react";
import { Input, Button, Avatar, Spacer } from "@nextui-org/react";
import { FiSend } from "react-icons/fi";
import { AppContext } from "../../context/app-context";

const contacts = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "online",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    name: "Bob Smith",
    status: "offline",
    lastMessage: "See you tomorrow!",
  },
  {
    id: 3,
    name: "Charlie Brown",
    status: "online",
    lastMessage: "Thanks for your help!",
  },
  {
    id: 4,
    name: "Diana Prince",
    status: "offline",
    lastMessage: "Movie night on Friday?",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    status: "online",
    lastMessage: "Mission accomplished!",
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "Alice",
    content: "Hey there! How are you?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "You",
    content: "I'm doing great, thanks! How about you?",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    sender: "Alice",
    content: "Pretty good! Just working on a new project.",
    timestamp: "10:05 AM",
  },
  {
    id: 4,
    sender: "You",
    content: "That sounds interesting! What kind of project?",
    timestamp: "10:07 AM",
  },
  {
    id: 5,
    sender: "Alice",
    content: "It's a web application for real-time collaboration.",
    timestamp: "10:10 AM",
  },
  {
    id: 6,
    sender: "You",
    content: "That's awesome! I've heard great things about NextUI.",
    timestamp: "10:12 AM",
  },
  {
    id: 7,
    sender: "Alice",
    content: "I'm planning to use WebSockets for real-time communication.",
    timestamp: "10:15 AM",
  },
];

export default function ChatMessagesAdmin() {
  const { user ,currentCompany}=useContext(AppContext);

  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      if(user?.role=='MANAGER') {
        const message = {
          id: messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([...messages, message]);
        setNewMessage("");
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }else if(user?.role=='CLIENT'){
        const message = {
          id: messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([...messages, message]);
        setNewMessage("");
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
     
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="p-4 border-b sticky top-0 z-10 bg-white dark:bg-gray-800">
        <div className="flex gap-2 items-center">
          <Avatar
            size="lg"
            name={activeContact.name[0].toUpperCase()}
            color={activeContact.status === "online" ? "success" : "default"}
          />
          <div className="flex gap-2 items-center">
            <b>{activeContact.name}</b>
            <small className="flex items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full mr-1 ${
                  activeContact.status === "online"
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></div>
              {activeContact.status}
            </small>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black dark:bg-gray-700 dark:text-white"
              }`}
            >
              <p>{message.content}</p>
              <small className="mt-1 opacity-70">{message.timestamp}</small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="dark:bg-gray-800">
        <div className="flex gap-1 my-2 items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Spacer x={0.5} />
          <Button isIconOnly onPress={handleSendMessage}>
            <FiSend size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
