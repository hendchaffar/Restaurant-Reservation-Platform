import { useAxios } from "../../hooks/fetch-api.hook";
import { Company, Order } from "../../types";
import TableList from "../../components/table/table";
import { useEffect, useState } from "react";
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

const CompanyList = () => {
  const { companies } = useAxios("companies", "GET", {}, "companies");

  return (
    <>
      <TableList<Company>
        data={companies.responseData}
        columnsHeaders={[
          "logo",
          "name",
          "address",
          "phone",
          "startHour",
          "endHour",
          "type",
        ]}
        columnKeys={[
          "logo",
          "name",
          "address",
          "phone",
          "startHour",
          "endHour",
          "type",
        ]}
        imageKey="logo"
      />
    </>
  );
};

export default CompanyList;
