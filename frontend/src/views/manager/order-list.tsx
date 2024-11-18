import { useAxios } from "../../hooks/fetch-api.hook";
import { Order } from "../../types";
import TableList from "../../components/table/table";
import { useEffect, useState } from "react";
import CustomModal from "../../components/modal";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";

const OrderList = () => {
  const status = ["Preparing", "ReadyForPickup", "OutForDelivery","Delivered","Completed"];

  const { orders } = useAxios("orders", "GET", {}, "orders");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [form, setForm] = useState({
    id: 0,
    status: "",
  });
  const { updateOrderStatus } = useAxios(``, "PUT", {}, "updateOrderStatus", false);

  const [isFormValid, setIsFormValid] = useState(false);
  
  const handleCancel = () => {
    onOpenChange();
  };

  useEffect(() => {
    if (updateOrderStatus.responseData) {
      orders.refreshData();
    }
  }, [updateOrderStatus.responseData]);

  const handleSubmit = () => {
    console.log('form',form);
    updateOrderStatus.submitRequest(
      {
        status: form.status,
      },
      `orders/changeStatus/${form.id}`
    );
    onOpenChange();
  };

  const handleUpdate = (item: Order) => {
    onOpenChange();
    setForm({
      id: +item.id,
      status: item.status,
    });
  };

  useEffect(() => {
    setIsFormValid(form.status !== "");
  }, [form]);

  return (
    <>
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
                  Change order status
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
      <TableList<Order>
      data={orders.responseData}
      columnsHeaders={[
        "status", "menus", "totalPrice", "orderType", "paymentStatus", "payment type"
      ]}
      columnKeys={[
        "status", "payment.menus.items", "totalPrice", "orderType", "paymentStatus", "payment.paymentType"
      ]}
      onUpdate={handleUpdate}

    />
    </>
  
  );
};

export default OrderList;
