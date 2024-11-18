import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import CustomModal from "../../components/modal";
import { useAxios } from "../../hooks/fetch-api.hook";
import { AppContext } from "../../context/app-context";
import { Reservation } from "../../types";
import { io } from "socket.io-client";

export default function MyReservationsPage() {
  const [expiredReservations, setExpiredReservations] = useState(false);
  const { currentCompany, user } = useContext(AppContext);
  const [form, setForm] = useState({
    date: null,
    time: null,
    numberOfpeople: 0,
    status: "",
    user: null,
    company: null,
    table: null,
  });
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const { reservations } = useAxios(
    `reservations/reservationperuser/${user?.id}`,
    "GET",
    {},
    "reservations"
  );

  const { tables } = useAxios(
    `tables/${currentCompany?.id}`,
    "GET",
    {},
    "tables",
    true,
    {
      available: true,
    }
  );
  const { reservationPost } = useAxios(
    `reservations`,
    "POST",
    {},
    "reservationPost",
    false
  );
  const { reservationDelete } = useAxios(
    `reservations`,
    "DELETE",
    {},
    "reservationDelete",
    false
  );
  const socket = io(process.env.API_URL, {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on(`${user?.id}-${currentCompany?.id}`, (newMessage) => {
      reservations.refreshData();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user?.id, currentCompany?.id]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFormValid, setIsFormValid] = useState(false);
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const [initialOpeningHours, setInitialOpeningHours] = useState<string[]>([]);

  useEffect(() => {
    if (currentCompany?.startHour && currentCompany.endHour) {
      const openingHour = parseInt(currentCompany.startHour.split(":")[0], 10);
      let closingHour = parseInt(currentCompany.endHour.split(":")[0], 10);
  
      if (closingHour <= openingHour) {
        closingHour += 24;
      }
  
      const hours = Array.from(
        { length: closingHour - openingHour },
        (_, i) => {
          const hour = (openingHour + i) % 24;
          return `${hour.toString().padStart(2, "0")}:00`;
        }
      );
  
      setInitialOpeningHours(hours); 
      setOpeningHours(hours); 
    }
  }, [currentCompany]);
  

  const [openingHours, setOpeningHours] = useState<string[]>([]);

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    onOpen();
  };

  const handleCancelReservation = (idReservation: number) => {
    reservationDelete.submitRequest(
      {},
      `reservations/${idReservation}/${user?.id}`
    );
  };

  useEffect(() => {
    if (reservationDelete.responseData) {
      reservations.refreshData();
      tables.refreshData();
      setSelectedReservation(null);
    }
  }, [reservationDelete.responseData]);

  useEffect(() => {
    if (reservationPost.responseData) {
      reservations.refreshData();
    }
  }, [reservationPost.responseData]);

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    setIsFormValid(!!form.date && !!form.time && !!form.numberOfpeople);
  }, [form]);

  const handleSubmit = () => {
    if (isFormValid && user?.id && currentCompany?.id) {
      reservationPost.submitRequest({
        date: form.date,
        time: form.time,
        numberOfPeople: +form.numberOfpeople,
        status: "Pending",
        user: user?.id,
        company: currentCompany?.id,
        table: tables.responseData.find(
          (t: any) => t.tableSize == form.numberOfpeople
        )?.id,
      });
    }
  };

  const handleCancel = () => {
    setForm({
      date: null,
      time: null,
      numberOfpeople: 0,
      status: "",
      user: null,
      company: null,
      table: null,
    });
  };

  useEffect(() => {
    if (reservations.responseData) {
      const res: Reservation[] = reservations.responseData;

      const now = new Date();

      const allExpired = res.reduce((isExpired, currentReservation) => {
        const reservationDateTime = new Date(
          `${currentReservation.date}T${currentReservation.time}`
        );
        return isExpired && reservationDateTime < now;
      }, true);

      setExpiredReservations(allExpired);
    }
  }, [reservations.responseData]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (selectedDate: any) => {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
  
    setForm({ ...form, date: selectedDate });
  
    if (
      selectedDateObj.getFullYear() === currentDate.getFullYear() &&
      selectedDateObj.getMonth() === currentDate.getMonth() &&
      selectedDateObj.getDate() === currentDate.getDate()
    ) {
      setOpeningHours(openingHours.filter((hour) => hour > getCurrentTime()));
    } else {
      setOpeningHours(initialOpeningHours);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Reservations</h1>
      <div className="flex justify-end my-4">
        <CustomModal
          cancelButtonName="Cancel"
          submitButtonName="Make Reservation"
          title="Make a Reservation"
          openButtonName="Book your table now"
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          disabled={isFormValid}
          disabledMainButton={!expiredReservations}
        >
          <div className="flex flex-col  gap-4 w-full">
            {" "}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="date"
                label="Date"
                placeholder="Select date"
                className="flex-1"
                min={getTodayDate()}
                onChange={(e: any) => {
                  handleDateChange(e.target.value)
                }}
              />
              <Select
                label="Time"
                placeholder="Select time"
                className="flex-1"
                onChange={(e: any) =>
                  setForm({ ...form, time: e.target.value })
                }
              >
                {openingHours.map((t) => (
                  <SelectItem key={t}>{t}</SelectItem>
                ))}
              </Select>
            </div>
            <Select
              label="Party Size"
              selectedKeys={[form.numberOfpeople]}
              onChange={(e: any) =>
                setForm({ ...form, numberOfpeople: e.target.value })
              }
            >
              {Array.isArray(tables?.responseData) &&
              tables.responseData.length > 0 ? (
                tables.responseData
                  .sort((a, b) => a.tableSize - b.tableSize)
                  .map((size) => (
                    <SelectItem
                      key={size.tableSize}
                      textValue={`${size.tableSize} ${
                        size.tableSize === 1 ? "person" : "people"
                      }`}
                    >
                      {size.tableSize}{" "}
                      {size.tableSize === 1 ? "person" : "people"}
                    </SelectItem>
                  ))
              ) : (
                <SelectItem key={""} value="" textValue="No tables available">
                  No tables available
                </SelectItem>
              )}
            </Select>
          </div>
        </CustomModal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.responseData &&
          reservations?.responseData?.map((reservation: Reservation) => (
            <Card
              key={reservation.id}
              className="w-full transition-transform transform hover:scale-105 duration-300 ease-in-out "
            >
              <CardBody>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  <span>{reservation.date.toString()}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaClock className="w-4 h-4 mr-2" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaUsers className="w-4 h-4 mr-2" />
                  <span>{reservation.numberOfPeople} people</span>
                </div>
                <div
                  className={`font-semibold ${getStatusColor(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </div>
              </CardBody>
              <CardFooter className="flex justify-between">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => handleViewDetails(reservation)}
                >
                  <FaEye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => handleCancelReservation(reservation.id)}
                >
                  <FaTrashAlt className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reservation Details
              </ModalHeader>
              <ModalBody>
                {selectedReservation && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedReservation.company.name}
                    </h3>
                    <p>
                      <strong>Date:</strong>{" "}
                      {selectedReservation.date.toString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedReservation.time}
                    </p>
                    <p>
                      <strong>Party Size:</strong>{" "}
                      {selectedReservation.numberOfPeople} people
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={getStatusColor(selectedReservation.status)}
                      >
                        {selectedReservation.status}
                      </span>
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
