import React, { useState, useEffect, useContext } from "react";
import { Card, CardBody, CardHeader, Input, Button } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../client/login";
import { AppContext } from "../../context/app-context";
import { useAxios } from "../../hooks/fetch-api.hook";

const Profile = () => {
  const { user, refreshContext } = useContext(AppContext);

  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address:"",
    phone:"",
    password: "",
    confirmPassword: "",
  });
  const [inputErrors, setInputErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address:"",
    phone:"",
    password: "",
    confirmPassword: "",
  });
  const { userDataFromApi } = useAxios(`users/${user?.id}`, "GET", {}, "userDataFromApi");

  const { profile } = useAxios(`users`, "PATCH", {}, "profile", false);

  useEffect(() => {
    setForm({
      firstname: userDataFromApi.responseData?.firstname || "",
      lastname: userDataFromApi.responseData?.lastname || "",
      email: userDataFromApi.responseData?.email || "",
      address:userDataFromApi.responseData?.address || "",
      phone:userDataFromApi.responseData?.phone || "",
      password: "",
      confirmPassword: "",
    });
    if(userDataFromApi.responseData){
      refreshContext(userDataFromApi.responseData,userDataFromApi.responseData?.role)

    }
  }, [userDataFromApi.responseData]);
  const [isFormValid, setIsFormValid] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateName = (name: string) => {
    return name.length >= 2;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6 || password.length === 0;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    let errorMessage = "";
    if (name === "name") {
      errorMessage = validateName(value)
        ? ""
        : "Name must be at least 2 characters";
    } else if (name === "email") {
      errorMessage = validateEmail(value) ? "" : "Please enter a valid email";
    } else if (name === "password") {
      errorMessage = validatePassword(value)
        ? ""
        : "Password must be at least 6 characters";
    } else if (name === "confirmPassword") {
      errorMessage = validateConfirmPassword(form.password, value)
        ? ""
        : "Passwords do not match";
    }

    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  useEffect(() => {
    setIsFormValid(
      validateName(form.firstname) &&
        validateName(form.lastname) &&
        validateEmail(form.email) &&
        validatePassword(form.password) &&
        validateConfirmPassword(form.password, form.confirmPassword)
    );
  }, [form]);

  const handleSubmit = () => {
    if (isFormValid) {
      profile.submitRequest(
        form,
        `users/${user?.id}`
      );
    }
  };

  useEffect(() => {
    if (profile.responseData && !profile.error) {
      refreshContext(profile.responseData, profile.responseData.role);
    }
  }, [profile.responseData, profile.error]);

  return (
    <div className="flex justify-center items-start p-4">
      <Card className="w-full max-w-full  ">
        <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
          <h2 className="text-2xl font-bold dark:text-purple-400">
            Update Your Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Keep your information up to date
          </p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <div className="flex flex-col gap-4">
            <Input
              label="firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleInputChange}
              isInvalid={!!inputErrors.firstname}
              errorMessage={inputErrors.firstname}
            />
            <Input
              label="lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleInputChange}
              isInvalid={!!inputErrors.lastname}
              errorMessage={inputErrors.lastname}
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              isInvalid={!!inputErrors.email}
              errorMessage={inputErrors.email}
            />
               <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      isInvalid={!!inputErrors.phone}
                      errorMessage={inputErrors.phone}
                    />
                        <Input
                      label="Address"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      isInvalid={!!inputErrors.address}
                      errorMessage={inputErrors.address}
                    />
            <Input
              label="New Password (optional)"
              name="password"
              type={isVisible ? "text" : "password"}
              value={form.password}
              onChange={handleInputChange}
              isInvalid={!!inputErrors.password}
              errorMessage={inputErrors.password}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            {form.password && (
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleInputChange}
                isInvalid={!!inputErrors.confirmPassword}
                errorMessage={inputErrors.confirmPassword}
              />
            )}
            <Button
              color="primary"
              className="w-full mt-4 bg-gradient-to-b from-purple-600 to-indigo-700 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Update Profile
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
