import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app-context";
import { useAxios } from "../../hooks/fetch-api.hook";
import ImagePreview from "../../components/image-preview";

const CompanyInfo = () => {
  const { currentCompany } = useContext(AppContext);
  const companyTypes = ["Restaurant", "Coffeshop", "Bakery"];

  const handleFileUpload = () => {};

  return (
    <>
      <div className="flex justify-center items-start p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
            <h2 className="text-2xl font-bold dark:text-purple-400">
              {currentCompany?.type} Informations
            </h2>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                Keep your incurrentCompany?ation up to date
              </p> */}
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <ImagePreview
              readonly={true}
              handleFileUpload={handleFileUpload}
              previewUrl={currentCompany?.logo!}
            />
            <Input
              type={"text"}
              name="name"
              label="name"
              readOnly
              value={currentCompany?.name}
            />
            <Input
              type={"text"}
              name="address"
              label="address"
              readOnly
              value={currentCompany?.address}
            />
            <Input
              type={"tel"}
              name="phone"
              label="phone"
              value={currentCompany?.phone}
            />
            <Input
              type="tel"
              label="StartHour"
              name="StartHour"
              readOnly
              value={currentCompany?.startHour}
            />
            <Input
              type="tel"
              label="EndHour"
              name="EndHour"
              readOnly
              value={currentCompany?.endHour}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default CompanyInfo;
