import { useAxios } from "../../hooks/fetch-api.hook";
import { Category } from "../../types";
import TableList from "../../components/table/table";
import CustomModal from "../../components/modal";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";

import { icons } from "../../constants";
import { AppContext } from "../../context/app-context";

const CategoriesList = () => {
  const columnKeys: any[] = ["id", "categoryName"];
  const {user}=useContext(AppContext)
  const [form, setForm] = useState({
    categoryName: "",
    color: "",
    icon: "",
    company:""
  });

  const { categories } = useAxios(
    "categories",
    "GET",
    {},
    "categories",
    true,{
      company: {
        id: user?.company?.id,
      },
    }
  );
  const { categoryPost } = useAxios(
    "categories",
    "POST",
    {},
    "categoryPost",
    false
  );
  const { categoryDelete } = useAxios(
    "categories",
    "DELETE",
    {},
    "categoryDelete",
    false
  );

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(!!form.categoryName && !!form.color && !!form.icon);
    console.log("setIsFormValid", isFormValid);
  }, [form]);

  const handleSubmit = () => {
    if (isFormValid) {
      categoryPost.submitRequest(
        {
          categoryName: form.categoryName,
          color: form.color,
          icon: form.icon,
          company:user?.company.id,
        },
        "categories"
      );
    }
  };

  useEffect(() => {
    if (categoryPost.responseData) {
      categories.refreshData();
      setForm({ categoryName: "", color: "", icon: "",company:"" });
    }

    if (categoryDelete.responseData) {
      categories.refreshData();
      setForm({ categoryName: "", color: "", icon: "",company:""});
    }
  }, [categoryPost.responseData, categoryDelete.responseData]);

  const handleCancel = () => {
    setForm({ categoryName: "", color: "", icon: "" ,company:""});
  };

  const handleChangeComplete = (e: any) => {
    setForm({ ...form, color: e.hex });
  };

  const handleDelete = (item: any) => {
    categoryDelete.submitRequest({}, `categories/${item}`);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex justify-end">
        <CustomModal
          cancelButtonName="Cancel"
          submitButtonName="Submit"
          title="Add new category"
          openButtonName="Add Category"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          disabled={isFormValid}
        >
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="" className="font-bold">
              Color
            </label>
            <TwitterPicker
              onChangeComplete={handleChangeComplete}
              color={form.color}
            />
            <Input
              label="categoryName"
              name="categoryName"
              value={form.categoryName}
              onChange={(e) =>
                setForm({ ...form, categoryName: e.target.value })
              }
            />
            <Select
              label="Select category icon"
              selectedKeys={[form.icon]}
              onChange={(e: any) => {
                setForm({ ...form, icon: e.target.value });
              }}
            >
              {icons.map((iconObject) => (
                <SelectItem
                  key={iconObject.categoryName}
                  textValue={` ${iconObject.categoryName}`}
                >
                  {iconObject.icon} {iconObject.categoryName}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CustomModal>
      </div>

      <TableList<Category>
        data={categories.responseData}
        columnsHeaders={columnKeys}
        columnKeys={columnKeys}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CategoriesList;
