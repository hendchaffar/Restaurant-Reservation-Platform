import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Input,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { FaSearch } from "react-icons/fa";
import { Category, Menu } from "../../types";
import { AppContext } from "../../context/app-context";
import { useAxios } from "../../hooks/fetch-api.hook";
import { icons } from "../../constants";
import { useNavigate } from "react-router-dom";

const MenuCards = () => {
  const { currentCompany } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openCart, setOpenCart] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null);
  const { cart, addToCart } = useContext(AppContext);
  const { categories } = useAxios(
    'categories',
    "GET",
    {},
    "categories",true,{
      company:{id: currentCompany?.id}
    }
  );
  const navigate = useNavigate();
  const { menus } = useAxios("menus", "GET", {}, "menus", true, {
    company: { id: currentCompany?.id },
  });
  const [filteredItems, setFilteredItems] = useState<Menu[]>(
    menus.responseData
  );

  useEffect(() => {
    setFilteredItems(menus.responseData);
  }, [menus.responseData]);

  useEffect(() => {
    const filtered = menus?.responseData?.filter((item: Menu) => {
      const matchesCategory =
        selectedCategory === "all" || item.category.id == selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery]);

  const addCart = (item: Menu) => {
    setOpenCart(true);
    setIsFadingOut(false);
    addToCart(item);
  };

  const getTotalPrice = () => {
    return cart?.items
      .reduce((total, { item, quantity }) => {
        return total + item.price * quantity;
      }, 0)
      .toFixed(2);
  };

  const openItemModal = (item: Menu) => {
    setSelectedItem(item);
    onOpen();
  };

  const [isFadingOut, setIsFadingOut] = useState(false);
  useEffect(() => {
    if (openCart) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setOpenCart(false);
        }, 1000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [openCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Menu</h1>
        <div className="relative">
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<FaSearch className="text-gray-400" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {/* { id: "all", name: "All Items", icon: <FaSearch />, color: "#4B0082" }, */}

        <Card
          key={"all"}
          isPressable
          onPress={() => setSelectedCategory("all")}
          className={`${
            selectedCategory === "all" ? "ring-2 ring-offset-2 " : ""
          }`}
          style={{ backgroundColor: "#4B0082" }}
        >
          <CardBody className="flex flex-col items-center gap-2 text-white p-4">
            <div className="text-3xl">
              <FaSearch size={24} />
            </div>
            <div className="text-sm font-semibold text-center">All Items</div>
          </CardBody>
        </Card>
        {categories?.responseData?.map((category: Category) => (
          <Card
            key={category.id}
            isPressable
            onPress={() => setSelectedCategory(category.id.toString())}
            className={`${
              +selectedCategory === category.id ? "ring-2 ring-offset-2 " : ""
            }`}
            style={{ backgroundColor: category.color }}
          >
            <CardBody className="flex flex-col items-center gap-2 text-white p-4">
              <div className="text-3xl">
                {icons.find((i) => i.categoryName == category.icon)?.icon}
              </div>
              <div className="text-sm font-semibold text-center">
                {category.categoryName}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems?.map((item) => (
          <Card
            key={item.id}
            className="h-[300px] transition-transform transform hover:scale-110 duration-300 ease-in-out"
            isPressable
            onPress={() => openItemModal(item)}
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <h4 className="text-white font-medium text-xl bg-black/60 p-2 rounded">
                {item.name}
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt={item.name}
              className="z-0 w-full h-full object-cover"
              src={item.imageURL}
            />
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <div className="flex flex-col">
                  <p className="text-tiny text-white/60">Price</p>
                  <p className="text-white text-medium">{item.price} DT</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                  onPress={() => addCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {cart && cart?.items.length > 0 && openCart && (
        <div
          className={`fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="text-lg font-bold mb-2">Cart</h2>
          {cart?.items.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="flex gap-1 justify-between items-center mb-2"
            >
              <span>
                {quantity} x {item.name}
              </span>
              <span> {(item.price * quantity).toFixed(2)} DT</span>
            </div>
          ))}
          <div className="border-t border-white/20 mt-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${getTotalPrice()} DT</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Button
              className="bg-secondary w-full mt-4 p-2 rounded-lg text-white"
              onPress={() => {
                navigate("/client/cart");
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedItem?.name}
              </ModalHeader>
              <ModalBody>
                <Image
                  src={selectedItem?.imageURL}
                  alt={selectedItem?.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p>{selectedItem?.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div
                    className="text-white rounded-full p-2 text-sm"
                    style={{ backgroundColor: selectedItem?.category.color }}
                  >
                    {selectedItem?.category.categoryName}
                  </div>
                  <span className="text-lg font-bold">
                    {selectedItem?.price} DT
                  </span>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (selectedItem) addToCart(selectedItem);
                    onClose();
                  }}
                >
                  Add to Cart
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MenuCards;
