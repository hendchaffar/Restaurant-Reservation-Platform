import { Button } from "@nextui-org/react";
import { FaRobot } from "react-icons/fa";

const BotAvatar = () => {
  return (
    <Button isIconOnly className="bg-gray-500 rounded-full p-2 text-white mr-2">
      <FaRobot size={23} />
    </Button>
  );
};
export default BotAvatar;
