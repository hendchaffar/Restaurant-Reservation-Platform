import { useContext } from "react";
import { AppContext } from "../context/app-context";
import { Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeliveryDining } from "react-icons/md";

const AppLogo = ({ bordred = true }) => {
  const { currentCompany, user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`flex items-center justify-start gap-3 mb-1 px-2  cursor-pointer 
        ${bordred ? "pb-4 border-b dark:border-purple-400" : ""}`}
        onClick={() => {
          if (user?.role == "CLIENT") {
            navigate("/client/company-info");
          }
        }}
      >
        <div className="cursor-pointer rounded-full bg-white p-1 blue-text-color dark:bg-purple-500 dark:text-gray-900">
          {(currentCompany?.logo || user?.company?.logo )? (
            <Image src={currentCompany?.logo || user!.company?.logo} className="h-7 w-7" />
          ) : (
            <MdOutlineDeliveryDining className="h-6 w-6" />
          )}
        </div>
        <h1 className="text-xl font-bold dark:text-purple-400">
          {(currentCompany?.name || user?.company?.name ) || 'ADMIN PANEL'}
        </h1>
      </div>
    </>
  );
};

export default AppLogo;
