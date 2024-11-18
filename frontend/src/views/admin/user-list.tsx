import { useAxios } from "../../hooks/fetch-api.hook";
import { User } from "../../types";
import TableList from "../../components/table/table";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app-context";

const UserList = () => {
  const { user } = useContext(AppContext);
  const { users } = useAxios("users", "GET", {}, "users");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminConfirmOpen, setIsAdminConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    enable: true,
    isConfirmedByAdministrator: false,
  });
  const { userupdated } = useAxios(`users`, "PATCH", {}, "userupdated", false);

  const handleCancel = () => {
    setIsOpen(false);
    setIsAdminConfirmOpen(false);
  };

  useEffect(() => {
    if (userupdated.responseData) {
      users.refreshData();
    }
  }, [userupdated.responseData]);

  const handleSubmit = () => {
    userupdated.submitRequest(
      {
        enable: !form.enable,
      },
      `users/${form.id}`,
      true
    );
    setIsOpen(false);
  };

  const handleAdminConfirmSubmit = () => {
    userupdated.submitRequest(
      {
        isConfirmedByAdministrator: !form.isConfirmedByAdministrator,
      },
      `users/${form.id}`,
      true
    );
    setIsAdminConfirmOpen(false);
  };

  const handleUpdate = (item: User) => {
    setIsOpen(true);
    setForm({
      id: +item.id,
      enable: item.enable,
      isConfirmedByAdministrator: item.isConfirmedByAdministrator,
    });
  };

  const handleAdminConfirmation = (item: User) => {
    setIsAdminConfirmOpen(true);
    setForm({
      id: +item.id,
      enable: item.enable,
      isConfirmedByAdministrator: item.isConfirmedByAdministrator,
    });
  };

  return (
    <div>
      <TableList<User>
        data={users.responseData}
        columnsHeaders={[
          "firstname",
          "lastname",
          "email",
          "role",
          "company name",
          "active",
          "confirmed by admin",
        ]}
        columnKeys={[
          "firstname",
          "lastname",
          "email",
          "role",
          "company.name",
          "enable",
          "isConfirmedByAdministrator",
        ]}
        rowsPerPage={5}
        onUpdate={handleUpdate}
        onAdminConfirm={handleAdminConfirmation}
      />

      {/* First Modal for enabling/disabling users */}
      <div className="flex justify-end">
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={() => setIsOpen(false)}
          className="overflow-y-auto p-5"
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex justify-center">
                  {`Are you sure you want to ${
                    form.enable ? "ban" : "unban"
                  } this user?`}
                </ModalHeader>
                <ModalFooter className="flex justify-center">
                  <Button
                    color="primary"
                    variant="shadow"
                    onClick={handleSubmit}
                  >
                    Yes
                  </Button>
                  <Button
                    color="danger"
                    variant="shadow"
                    onClick={handleCancel}
                  >
                    No
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Second Modal for confirming administrator approval */}
      <div className="flex justify-end">
        <Modal
          backdrop="opaque"
          isOpen={isAdminConfirmOpen}
          onOpenChange={() => setIsAdminConfirmOpen(false)}
          className="overflow-y-auto p-5"
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex justify-center">
                  {`Are you sure you want to ${
                    form.isConfirmedByAdministrator ? "revoke" : "confirm"
                  } administrator approval for this user?`}
                </ModalHeader>
                <ModalFooter className="flex justify-center">
                  <Button
                    color="primary"
                    variant="shadow"
                    onClick={handleAdminConfirmSubmit}
                  >
                    Yes
                  </Button>
                  <Button
                    color="danger"
                    variant="shadow"
                    onClick={handleCancel}
                  >
                    No
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default UserList;
