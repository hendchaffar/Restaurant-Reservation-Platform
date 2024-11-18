import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Input,
  Link,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import AppLogo from "../../components/app-logo";
import { useAxios } from "../../hooks/fetch-api.hook";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/app-context";
import ImagePreview from "../../components/image-preview";
import { MdOutlineDeliveryDining } from "react-icons/md";

const CompanyPage = () => {
  const { user,refreshUserCredential } = useContext(AppContext);
  const companyTypes = ["Restaurant", "Coffeshop", "Bakery"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    logo: "",
    openingHours: "",
    type: "",
    manager: "",
    startHour: "",
    endHour: "",
  });

  const [inputErrors, setInputErrors] = useState({
    name: null,
    address: null,
    phone: null,
    logo: null,
    startHour: null,
    endHour: null,
    type: null,
    manager: null,
  });

  const { companies } = useAxios("companies", "POST", {}, "companies", false);
  const navigate = useNavigate();

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    let errorMessage = "";

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  useEffect(() => {
    setIsFormValid(
      !!form.address &&
        !!form.name &&
        !!form.phone &&
        !!form.type &&
        !!form.startHour &&
        !!form.endHour
    );
  }, [form]);

  const handleSubmit = () => {
    console.log('form',form)
    if (isFormValid) {
      const formData = new FormData();
      if (form.logo) {
        formData.append('logo', form.logo);
      }
      formData.append("address", form.address);
      formData.append("name", form.name);
      formData.append("manager",  user!.id.toString());
      formData.append("phone", form.phone);
      formData.append("startHour", form.startHour);
      formData.append("endHour", form.endHour);
      formData.append("type", form.type);
      companies.submitRequest(formData);
      setPreviewUrl("");
    }
  };

  useEffect(() => {
    if (companies.responseData && !companies.error) {
      refreshUserCredential({...user!,company:companies!.responseData})
      navigate("/manager/dashboard");
    }
  }, [companies.responseData, companies.error]);

  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileUpload = (event: any) => {
    const logo = event.target.files?.[0];
    console.log('logo', logo)

    if (logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        console.log('logo', logo)
        console.log('result', result)

        setForm((prevForm) => ({ ...prevForm, logo: logo }));
      };
      reader.readAsDataURL(logo);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
        <div
            className={`flex items-center justify-start gap-3 mb-1 px-2  cursor-pointer pb-4 border-b dark:border-purple-400`}
          >
            <div className="cursor-pointer rounded-full bg-white p-1 blue-text-color dark:bg-purple-500 dark:text-gray-900">
              <MdOutlineDeliveryDining className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold dark:text-purple-400">
              Restaurants Hub
            </h1>
          </div>
          <h2 className="mt-4 mb-2 text-2xl font-bold dark:text-purple-400">
            Create your company
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Fill your company informations
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <ImagePreview
          readonly={false}
            handleFileUpload={handleFileUpload}
            previewUrl={previewUrl}
          />
          <Input
            type="text"
            label="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            isInvalid={!!inputErrors.name}
            errorMessage={inputErrors.name}
          />
          <Input
            type="text"
            label="address"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            isInvalid={!!inputErrors.address}
            errorMessage={inputErrors.address}
          />
          <Input
            type="tel"
            label="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            isInvalid={!!inputErrors.phone}
            errorMessage={inputErrors.phone}
          />

          {/* Select for Opening Hours */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Select
                label="Start Hour"
                selectedKeys={[form.startHour]}
                onChange={(e: any) => {
                  setForm({ ...form, startHour: e.target.value });
                }}
              >
                {hours.map((hour) => (
                  <SelectItem key={hour}>{hour}</SelectItem>
                ))}
              </Select>

              <Select
                label="End Hour"
                selectedKeys={[form.endHour]}
                onChange={(e: any) => {
                  setForm({ ...form, endHour: e.target.value });
                }}
              >
                {hours.map((hour) => (
                  <SelectItem key={hour}>{hour}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="text-gray-400 italic pl-2 font-mono text-xs">
              Example: 9:00 - 18:00
            </div>
          </div>

          <Select
            label="Select type"
            className=""
            selectedKeys={[form.type]}
            onChange={(e: any) => {
              setForm({ ...form, type: e.target.value });
            }}
          >
            {companyTypes.map((r) => (
              <SelectItem key={r}>{r}</SelectItem>
            ))}
          </Select>

          <Button
            isDisabled={!isFormValid}
            onClick={handleSubmit}
            className="w-full mt-2 bg-gradient-to-b from-purple-600 to-indigo-700 text-white"
          >
            Submit
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanyPage;
