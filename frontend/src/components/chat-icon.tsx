import { Button } from "@nextui-org/react";
import { BsChatFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const ChatIcon = (props: { notifs: number; size: number,className:string }) => {
  const { notifs, size,className } = props;
  const navigate = useNavigate();

  return (
    <>
      <div className="relative cursor-pointer">
        <Button
          isIconOnly
          variant="light"
          className={`${className}`}
          onPress={() => {
            navigate("/client/chat");
          }}
        >
          <BsChatFill size={size} />
        </Button>

        {notifs > 0 && (
          <div className="absolute -top-1 bottom-3 left-5 w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
            <span className="text-white text-xs font-bold">{notifs}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatIcon;
