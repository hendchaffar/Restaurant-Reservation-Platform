import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  RadioGroup,
  Radio,
  Image,
  DropdownMenu,
  DropdownItem,
  NavbarContent,
  NavbarItem,
  Navbar,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  Avatar,
  Modal,
  Input,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import {
  FaCoffee,
  FaUtensils,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaHome,
  FaStarHalfAlt,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { ThemeSwitcher } from "../../utils/theme-switcher";
import { useAxios } from "../../hooks/fetch-api.hook";
import { Company, CompanyType } from "../../types";
import { AppContext } from "../../context/app-context";
import { useNavigate } from "react-router-dom";
import CompanyReviews from "./company-review";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./login";

export default function Places() {
  const { user, logout, refreshContext } = useContext(AppContext);

  const [selectedOption, setSelectedOption] = useState<CompanyType>(
    CompanyType.Coffeshop
  );
  const { companies } = useAxios("companies", "GET", {}, "companies");
  const navigate = useNavigate();
  const { setCompany } = useContext(AppContext);
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
  const { userDataFromApi } = useAxios(
    `users/${user?.id}`,
    "GET",
    {},
    "userDataFromApi"
  );
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
  const { profile } = useAxios(`users`, "PATCH", {}, "profile", false);
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
  const [isFormValid, setIsFormValid] = useState(false);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleProfileUpdate = () => {
    handleSubmit()
    setIsModalOpen(false);
    setForm({...form,password:"",confirmPassword:""})
  };

  const calculateRating = (company: Company) => {
    const totalReviews = company.reviews.length;
    const totalRating = company.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.min(totalRating / totalReviews, 5);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div
        className="flex items-center"
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="text-yellow-400" />;
          } else if (index === fullStars && hasHalfStar) {
            return <FaStarHalfAlt key={index} className="text-yellow-400" />;
          } else {
            return <FaRegStar key={index} className="text-yellow-400" />;
          }
        })}
      </div>
    );
  };

  const renderPlaces = (places: Company[]) => {
    if (places.length === 0) {
      return (
        <div className="text-center">
          <FaUtensils className="text-6xl mx-auto mb-4 text-purple-600" />
          <p className="text-xl">Listings coming soon!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place: Company) => (
          <Card
            key={place.id}
            isPressable
            className="max-w-sm shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <CardHeader className="flex justify-between">
              <div className="flex gap-3">
                {selectedOption === CompanyType.Coffeshop && (
                  <FaCoffee className="text-2xl text-purple-600" />
                )}
                {selectedOption === CompanyType.Bakery && (
                  <FaBirthdayCake className="text-2xl text-purple-600" />
                )}
                {selectedOption === CompanyType.Restaurant && (
                  <FaUtensils className="text-2xl text-purple-600" />
                )}
                <div className="text-md font-bold">{place.name}</div>
              </div>
              <div>
                <StarRating rating={calculateRating(place)} />
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <Image
                alt={place.name}
                className="w-full object-cover h-[200px]"
                src={place.logo}
              />
            </CardBody>
            <CardFooter className="flex flex-col items-start">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-purple-600" />{" "}
                {place.address}
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2 text-purple-600" /> {place.phone}
              </p>
              <p className="flex items-center">
                <FaClock className="mr-2 text-purple-600" /> {place.startHour} -{" "}
                {place.endHour}
              </p>
              <Button
                className="mt-4 w-full bg-purple-600 text-white hover:bg-purple-700"
                onPress={() => {
                  setCompany(place);
                  navigate("/client/menus");
                }}
              >
                Visit Website
              </Button>
              <CompanyReviews
                companyName={place.name}
                reviews={place.reviews}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const filterPlaces = (type: CompanyType) => {
    if (companies?.responseData) {
      return companies.responseData.filter(
        (place: Company) => place.type === type
      );
    }
    return [];
  };

  return (
    <div className="min-h-screen dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex mb-8  ">
          <div className="flex flex-col items-center w-full mb-8">
            <h1 className="text-4xl font-bold text-center text-purple-800 mb-5 ml-4">
              Food & Drink Finder
            </h1>
            <div className="flex justify-center items-center">
              <RadioGroup
                orientation="horizontal"
                value={selectedOption}
                onValueChange={(value) =>
                  setSelectedOption(value as CompanyType)
                }
              >
                <Radio value={CompanyType.Restaurant} color="secondary">
                  Restaurant
                </Radio>
                <Radio value={CompanyType.Coffeshop} color="secondary">
                  Coffee Shops
                </Radio>
                <Radio value={CompanyType.Bakery} color="secondary">
                  Bakeries
                </Radio>
              </RadioGroup>
            </div>
          </div>

          <div className="">
            <div className="flex items-center justify-end space-x-3">
              <ThemeSwitcher />

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name={`${user?.firstname
                      .charAt(0)
                      .toUpperCase()}${user?.lastname.charAt(0).toUpperCase()}`}
                    size="sm"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      console.log("dd", isModalOpen);
                    }}
                  >
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onPress={logout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {renderPlaces(filterPlaces(selectedOption))}

        <Modal
          backdrop="opaque"
          isOpen={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2>Update Profile</h2>
                </ModalHeader>
                <ModalBody>
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
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="success" onClick={handleProfileUpdate}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
