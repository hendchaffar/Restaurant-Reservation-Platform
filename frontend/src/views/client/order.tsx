import React, { useContext, useEffect } from "react";
import { Card, CardBody, Image, Chip } from "@nextui-org/react";
import { FaTruck, FaUtensils, FaMoneyBillWave, FaClock, FaShoppingBag, FaCheck } from "react-icons/fa";
import { useAxios } from "../../hooks/fetch-api.hook";
import { AppContext } from "../../context/app-context";
import { io } from "socket.io-client";


const statusConfig = {
  Delivered: { color: "warning", icon: FaTruck },      
  Preparing: { color: "primary", icon: FaUtensils },    
  Completed: { color: "success", icon: FaCheck },       
  ReadyForPickup: { color: "secondary", icon: FaShoppingBag }, 
  OutForDelivery: { color: "default", icon: FaTruck },     
};


const OrderPage = () => {
  const { user, currentCompany } = useContext(AppContext);
  const { orders } = useAxios("orders", "GET", {}, "orders", true, {
    user: {
      id: user?.id,
    },
    company: { id: currentCompany?.id },
  });
  const socket = io(process.env.API_URL, {
    transports: ["websocket"],
  });


  useEffect(() => {
    socket.on(`${user?.id}-${currentCompany?.id}`, (newMessage) => {
     orders.refreshData();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user?.id, currentCompany?.id]);


 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {!orders || orders.responseData?.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.responseData &&
            orders?.responseData?.map((order: any, index: number) => (
              <Card key={order.id} className="w-full">
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Image
                      src={order.company.logo}
                      alt={order.company.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-semibold">
                          {order.company.name}
                        </h2>
                        <Chip
                          startContent={React.createElement(
                            statusConfig[order.status].icon,
                            { size: 18 }
                          )}
                          color={statusConfig[order.status].color}
                          variant="flat"
                          className="p-1 cursor-pointer"
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Chip>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Order #{index + 1} -{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="p-1 cursor-pointer"
                        >
                          {order.orderType}
                        </Chip>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            order.paymentStatus === "Paid"
                              ? "success"
                              : "warning"
                          }
                          startContent={<FaMoneyBillWave size={14} />}
                          className="p-1 cursor-pointer"
                        >
                          {order.paymentStatus}
                        </Chip>
                      </div>
                      <ul className="list-disc list-inside mb-2">
                        {order.payment?.menus?.items?.map((i: any, index) => (
                          <li key={index} className="text-sm">
                            {i.quantity} x {i.item.name}  - {order.payment?.menus?.totalPrice} DT
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-lg">
                        Total: {order.totalPrice.toFixed(2) } DT
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
