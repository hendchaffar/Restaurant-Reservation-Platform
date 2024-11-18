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

const MyCompany = () => {
  const { user, refreshContext } = useContext(AppContext);
  const { userDataFromApi } = useAxios(
    `users/${user?.id}`,
    "GET",
    {},
    "userDataFromApi",
    false
  );
  const companyTypes = ["Restaurant", "Coffeshop", "Bakery"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    logo: "",
    startHour: "",
    endHour: "",
    type: "",
    manager: 0,
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
  const { companies } = useAxios("companies", "PATCH", {}, "companies", false);

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
    setForm({
      name: user?.company?.name || "",
      address: user?.company?.address || "",
      phone: user?.company?.phone || "",
      logo: user?.company?.logo || "",
      startHour: user?.company?.startHour || "",
      endHour: user?.company?.endHour || "",
      type: user?.company?.type || "",
      manager: user?.id || 0,
    });
    setPreviewUrl(user?.company?.logo);
  }, [user]);

  useEffect(() => {
    setIsFormValid(
      !!form.address &&
        !!form.logo &&
        !!form.name &&
        !!form.phone &&
        !!form.type &&
        !!form.startHour &&
        !!form.endHour
    );
  }, [form]);

  const handleSubmit = () => {
    if (isFormValid) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("phone", form.phone);

      if (typeof form.logo === "object") {
        formData.append("logo", form.logo);
        formData.append("logo", "");
      }

      formData.append("type", form.type);
      formData.append("startHour", form.startHour);
      formData.append("endHour", form.endHour);
      formData.append("manager", form.manager.toString() || "0");

      companies.submitRequest(formData, `companies/${+user?.company.id}`);
    }
  };

  useEffect(() => {
    if (companies.responseData) {
      userDataFromApi.submitRequest({}, `users/${user?.id}`);
    }
  }, [companies.responseData]);
  
  useEffect(() => {
    if (userDataFromApi.responseData) {
      refreshContext(
        userDataFromApi.responseData,
        userDataFromApi.responseData.role
      );
    }
  }, [userDataFromApi.responseData]);
  

  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileUpload = (event: any) => {
    const logo = event.target.files?.[0];
    if (logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setForm((prevForm) => ({ ...prevForm, logo: logo }));
      };
      reader.readAsDataURL(logo);
    }
  };

  return (
    <>
      <div className="flex justify-center items-start p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
            <h2 className="text-2xl font-bold dark:text-purple-400">
              Update Your Company Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Keep your information up to date
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <ImagePreview
              readonly={false}
              handleFileUpload={handleFileUpload}
              previewUrl={previewUrl}
            />
            <Input
              type={"text"}
              name="name"
              label="Name"
              value={form.name}
              onChange={handleInputChange}
            />
            <Input
              type={"text"}
              name="address"
              label="Address"
              value={form.address}
              onChange={handleInputChange}
            />
            <Input
              type={"tel"}
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleInputChange}
            />

            <div className="flex gap-4">
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
              Example: 6:00 - 18:00
            </div>

            <Select
              label="Select Type"
              className="mt-2"
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
    </>
  );
};

export default MyCompany;
