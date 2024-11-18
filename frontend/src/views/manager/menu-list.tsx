import { useAxios } from "../../hooks/fetch-api.hook";
import { Category, Menu } from "../../types";
import TableList from "../../components/table/table";
import CustomModal from "../../components/modal";
import { useContext, useEffect, useState } from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

import ImagePreview from "../../components/image-preview";
import { AppContext } from "../../context/app-context";
import DetailModal from "../../components/detail";

const MenuList = () => {
  const { user } = useContext(AppContext);

  const { menus } = useAxios("menus", "GET", {}, "menus", true, {
    company: { id: user?.company?.id },
  });
  const { categories } = useAxios("categories", "GET", {}, "categories", true, {
    company: {
      id: user?.company?.id,
    },
  });
  const { menuSubmit } = useAxios("menus", "POST", {}, "menuSubmit", false);
  const { menuUpdate } = useAxios("menus", "PATCH", {}, "menuUpdate", false);
  const { menuDelete } = useAxios("menus", "DELETE", {}, "menuDelete", false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const defaultForm = {
    id: 0,
    name: "",
    description: "",
    imageURL: "",
    price: "",
    stockNumber: "",
    preparationTime: "",
    isAvailable: true,
    category: "",
    company: "",
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setIsFormValid(
      !!form.name &&
        !!form.price &&
        !!form.stockNumber &&
        !!form.preparationTime &&
        !!form.category
    );
  }, [form]);

  useEffect(() => {
    if (menuSubmit.responseData) {
      menus.refreshData();
    }

    if (menuDelete.responseData) {
      menus.refreshData();
    }

    if (menuUpdate.responseData) {
      menus.refreshData();
    }
  }, [menuSubmit.responseData, menuDelete.responseData,menuUpdate.responseData]);

  const handleCancel = () => {
    setDetailModalOpen(!isDetailModalOpen);
    setForm(defaultForm);
    setPreviewUrl("");
  };

  const handleSubmit = () => {
    if (isFormValid && form.id == 0) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("imageURL", form.imageURL);
      formData.append("price", form.price);
      formData.append("stockNumber", form.stockNumber);
      formData.append("preparationTime", form.preparationTime);
      formData.append("isAvailable", form.isAvailable ? "true" : "false");
      formData.append("category", form.category);
      formData.append("company", user?.company?.id.toString());

      menuSubmit.submitRequest(formData);
  
    } else {
      console.log('form.imageURL',form.imageURL)
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("imageURL", form.imageURL);
      formData.append("price", form.price);
      formData.append("stockNumber", form.stockNumber);
      formData.append("preparationTime", form.preparationTime);
      formData.append("isAvailable", form.isAvailable ? "true" : "false");
      formData.append("category", form.category);
      formData.append("company", user?.company?.id.toString());

      menuUpdate.submitRequest(formData, `menus/${form.id}`);
   
    }
    setForm(defaultForm);

    setPreviewUrl("");
    setDetailModalOpen(false);

  };

  const handleDelete = (item: any) => {
    menuDelete.submitRequest({}, `menus/${item}`);
  };
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileUpload = (event: any) => {
    const imageURL = event.target.files?.[0];
    if (imageURL) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        console.log();
        setForm((prevForm) => ({ ...prevForm, imageURL: imageURL }));
      };
      reader.readAsDataURL(imageURL);
    }
  };
  const handleUpdate=(item:Menu)=>{
    console.log('update',item)
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      imageURL: "",
      price: item.price.toString(),
      stockNumber: item.stockNumber.toString(),
      preparationTime: item.preparationTime.toString(),
      isAvailable: item.isAvailable,
      category: item.category.id,
      company: user?.company?.id,
    });
    setPreviewUrl(item.imageURL);
    setDetailModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button color="primary" onPress={() => setDetailModalOpen(true)}>
          Add Menu
        </Button>
      
      </div>
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setDetailModalOpen(!isDetailModalOpen);
          setForm(defaultForm);
        }}
        title={form.id != 0 ? `Edit Menu` : "Create new Menu"}
      >
        <div className="flex flex-col  gap-4 w-full">
          <ImagePreview
            readonly={false}
            handleFileUpload={handleFileUpload}
            previewUrl={previewUrl}
          />
          <Input
            type="text"
            label="name"
            value={form.name}
            onChange={(e: any) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Enter your description"
            className=" "
            value={form.description}
            onChange={(e: any) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <div className="flex gap-1 items-center">
            <Input
              type={"number"}
              inputMode={"numeric"}
              label="price"
              value={form.price}
              onChange={(e: any) => setForm({ ...form, price: e.target.value })}
            />
            <label className="font-thin">DT</label>
          </div>

          <div className="flex gap-1 items-center">
            <Input
              type={"number"}
              inputMode={"numeric"}
              label="preparationTime"
              value={form.preparationTime}
              onChange={(e: any) =>
                setForm({ ...form, preparationTime: e.target.value })
              }
            />
            <label className="font-thin">Minutes</label>
          </div>

          <Input
            type={"number"}
            inputMode={"numeric"}
            label="stockNumber"
            value={form.stockNumber}
            onChange={(e: any) =>
              setForm({ ...form, stockNumber: e.target.value })
            }
          />
          <Select
            label="Select a catgeory"
            selectedKeys={
              form.category ? new Set([String(form.category)]) : new Set()
            }
            // onSelectionChange={selected => {
            //   console.log('selected',selected)
            //   const selectedKey = Array.from(selected)[0] as string;
            //   console.log(selectedKey)
            //   const selectedP = categories?.responseData.find(
            //     (u: any) => String(u.id) === selectedKey
            //   );
            //   // console.log('selected', selectedP)

            //   setForm(prevForm => ({
            //     ...prevForm,
            //     category: selectedP,
            //   }));
            // }}
            onChange={(e: any) => {
              console.log(e.target.value);
              setForm({ ...form, category: e.target.value });
            }}
          >
            {categories?.responseData?.map((category: Category) => (
              <SelectItem key={category.id}>{category.categoryName}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-4 mt-4">
            <Button color="primary" variant="solid" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              color="primary"
              variant="light"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
      </DetailModal>
      <TableList<Menu>
        data={menus.responseData}
        columnsHeaders={[
          "name",
          "image",
          "description",
          "category",
          "stockNumber",
          "preparationTime (Minutes)",
          "price (DT)",
          "isAvailable",
        ]}
        columnKeys={[
          "category.categoryName",
          "imageURL",
          "description",
          "name",
          "stockNumber",
          "preparationTime",
          "price",
          "isAvailable",
        ]}
        imageKey="imageURL"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MenuList;
