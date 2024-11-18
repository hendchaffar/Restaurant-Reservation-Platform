import { useAxios } from "../../hooks/fetch-api.hook";
import { Reservation } from "../../types";
import TableList from "../../components/table/table";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/app-context";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";

const ReservationList = () => {
  const { user } = useContext(AppContext);
  const { reservations } = useAxios(
    `reservations/getreservationbycompany/${user?.company?.id}`,
    "GET",
    {},
    "reservations"
  );
  const { updateStatus } = useAxios(``, "PUT", {}, "updateStatus", false);

  const [form, setForm] = useState({
    id: 0,
    status: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const status = ["Pending", "Confirmed", "Cancelled"];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCancel = () => {
    onOpenChange();
  };

  useEffect(() => {
    if (updateStatus.responseData) {
      reservations.refreshData();
    }
  }, [updateStatus.responseData]);

  const handleSubmit = () => {
    console.log('form',form);
    updateStatus.submitRequest(
      {
        status: form.status,
      },
      `reservations/changeStatus/${form.id}`
    );
    onOpenChange();
  };

  const handleUpdate = (item: Reservation) => {
    onOpenChange();
    setForm({
      id: item.id,
      status: item.status,
    });
  };

  useEffect(() => {
    setIsFormValid(form.status !== "");
  }, [form]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="w-[50vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-5"
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex">
                  Change reservation status
                </ModalHeader>
                <ModalBody className="max-h-[70vh] overflow-y-auto">
                  <Select
                    label="Select a status"
                    selectedKeys={[form.status]}
                    onChange={(selected: any) => {
                      setForm({ ...form, status: selected.target.value });
                    }}
                  >
                    {status.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="shadow"
                    isDisabled={!isFormValid}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    color="danger"
                    variant="shadow"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <TableList<Reservation>
        data={reservations.responseData}
        columnsHeaders={[
          "date",
          "time",
          "numberOfPeople",
          "status",
          "table",
          "user name",
        ]}
        columnKeys={[
          "date",
          "time",
          "numberOfPeople",
          "status",
          "table.tableNumber",
          "user.firstname",
        ]}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ReservationList;
