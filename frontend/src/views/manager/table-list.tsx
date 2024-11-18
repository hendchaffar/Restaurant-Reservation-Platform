import { useAxios } from "../../hooks/fetch-api.hook";
import { Table } from "../../types";
import CustomModal from "../../components/modal";
import { useContext, useEffect, useState } from "react";
import TableList from "../../components/table/table";
import { AppContext } from "../../context/app-context";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import DetailModal from "../../components/detail";

const TablesList = () => {
  const defaultForm = {
    id: 0,
    tableNumber: "",
    available: false,
    tableSize: "",
    company: "",
  };
  const [form, setForm] = useState(defaultForm);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const { user } = useContext(AppContext);
  const { tables } = useAxios(
    `tables/${user?.company?.id}`,
    "GET",
    {},
    "tables"
  );
  const { tablesPost } = useAxios("tables", "POST", {}, "tablesPost", false);
  const { tablesUpdate } = useAxios(
    "tables",
    "PATCH",
    {},
    "tablesUpdate",
    false
  );

  const { tablesDelete } = useAxios(
    "tables",
    "DELETE",
    {},
    "tablesDelete",
    false
  );
  const { updateStatus } = useAxios(``, "PUT", {}, "updateStatus", false);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(!!form.tableNumber && !!form.tableSize);
    console.log("setIsFormValid", isFormValid);
  }, [form]);

  const handleSubmit = () => {
    if (isFormValid) {
      if (form.id == 0) {
        tablesPost.submitRequest(
          {
            tableNumber: form.tableNumber,
            tableSize: form.tableSize,
            company: user?.company?.id,
          },
          "tables"
        );
      } else {
        tablesUpdate.submitRequest(
          form,
          `tables/${form.id}`
        );
      }
      setForm(defaultForm);
      setDetailModalOpen(false);
    }
  };

  useEffect(() => {
    if (tablesPost.responseData) {
      tables.refreshData();
      setForm(defaultForm);
    }

    if (tablesDelete.responseData) {
      tables.refreshData();
      setForm(defaultForm);
    }

    if (tablesUpdate.responseData) {
      tables.refreshData();
    }
  }, [tablesPost.responseData, tablesDelete.responseData,tablesUpdate.responseData]);

  const handleCancel = () => {
    setForm(defaultForm);
    setDetailModalOpen(false);
  };

  const handleDelete = (item: any) => {
    tablesDelete.submitRequest({}, `tables/${item}`);
  };
  const [tableStatus, setTableStatus] = useState({
    id: 0,
    available: false,
  });

  useEffect(() => {
    if (updateStatus.responseData) {
      tables.refreshData();
    }
  }, [updateStatus.responseData]);

  const handleUpdate = (form: Table) => {
    setForm({
      id: form.id,
      tableNumber: form.tableNumber,
      tableSize: form.tableSize.toString(),
      available: form.available,
      company: user?.company?.id,
    });
    setDetailModalOpen(true);
    setTableStatus({
      id: form.id,
      available: form.available,
    });
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex justify-end">
        <Button color="primary" onPress={() => setDetailModalOpen(true)}>
          Add Table
        </Button>
    
      </div>
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setDetailModalOpen(!isDetailModalOpen);
          setForm(defaultForm);
        }}
        title={form.id != 0 ? `Edit Table` : "Create new Table"}
      >
        <div className="flex flex-col gap-4 w-full">
          <Input
            type={"text"}
            name="tableNumber"
            label="tableNumber"
            value={form.tableNumber}
            onChange={(e: any) =>
              setForm({ ...form, tableNumber: e.target.value })
            }
          />
          <Select
            label="table Size"
            placeholder="Select table Size"
            selectedKeys={
              form.tableSize ? new Set([String(form.tableSize)]) : new Set()
            }
            onChange={(e: any) =>
              setForm({ ...form, tableSize: e.target.value })
            }
          >
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </Select>
          {form.id !== 0 && (
            <div className="flex gap-2">
              <label> Available</label>

              <Switch
                isSelected={form.available}
                onValueChange={(selected: boolean) => {
                  setForm({ ...form, available: selected });
                }}
                aria-label="Automatic updates"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button color="primary" variant="solid" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="primary" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </DetailModal>
      <TableList<Table>
        data={tables.responseData}
        columnsHeaders={["tableNumber", "tableSize", "available"]}
        columnKeys={["tableNumber", "tableSize", "available"]}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TablesList;
