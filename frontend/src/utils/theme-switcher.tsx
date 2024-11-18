import useDarkMode from "use-dark-mode";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Button } from "@nextui-org/react";

export const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  return (
    <div>
      {darkMode.value ? (
        <Button
          onClick={darkMode.disable}
          isIconOnly
          variant="light"
          className="text-white"
        >
          <span className=" text-gray-600 dark:text-white hover:text-gray-400 ">
            <MdLightMode size={30} />
          </span>
        </Button>
      ) : (
        <Button
          onClick={darkMode.enable}
          isIconOnly
          variant="light"
          className="text-white"
        >
          <span className=" text-gray-600 dark:text-white hover:text-gray-400 ">
            <MdDarkMode size={30} />
          </span>
        </Button>
      
      )}
    </div>
  );
};
