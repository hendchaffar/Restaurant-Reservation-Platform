import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import {
  IoCartOutline,
  IoPeopleOutline,
  IoCashOutline,
  IoRestaurantOutline,
  IoTime,
} from "react-icons/io5";
import { useAxios } from "../../hooks/fetch-api.hook";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app-context";
import { Category, Order, Payment } from "../../types";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const data = [
  { name: "Main Course", value: 400 },
  { name: "Appetizers", value: 300 },
  { name: "Desserts", value: 200 },
  { name: "Beverages", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Card {
  title: string;
  data: any;
  icon: any;
  color: string;
}

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const { users } = useAxios("users", "GET", {}, "users", true, {
    role: "CLIENT",
  });
  const { reservations } = useAxios(
    "reservations",
    "GET",
    {},
    "reservations",
    true,
    {
      company: {
        id: user?.company?.id,
      },
    }
  );
  const { orders } = useAxios("orders", "GET", {}, "orders", true, {
    company: {
      id: user?.company?.id,
    },
  });
  const { menus } = useAxios("menus", "GET", {}, "menus", true, {
    company: {
      id: user?.company?.id,
    },
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

  const { payments } = useAxios("payment", "GET", {}, "payments", true, {
    order: {
      paymentStatus: "Paid",
      company: {
        id: user?.company?.id,
      },
    },
  });

  const [cardList, setCardList] = useState<Card[]>([]);

  const getNumberOfUsers = (payments: Payment[]) => {
    const uniqueUserIds = new Set();
    payments.forEach((p) => {
      uniqueUserIds.add(p.user.id);
    });
    return uniqueUserIds.size;
  };

  useEffect(() => {
    if (
      users.responseData &&
      reservations.responseData &&
      orders.responseData &&
      payments.responseData
    ) {
      setCardList([
        {
          title: "Orders",
          data: orders.responseData.length,
          icon: <IoCartOutline size={32} />,
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Reservations",
          data: reservations.responseData.length,
          icon: <IoRestaurantOutline size={32} />,
          color: "bg-green-100 text-green-600",
        },
        {
          title: "Clients",
          data: getNumberOfUsers(payments.responseData as Payment[]),
          icon: <IoPeopleOutline size={32} />,
          color: "bg-yellow-100 text-yellow-600",
        },
        {
          title: "Revenue",
          data: `${(payments.responseData as Payment[]).reduce(
            (prv, acc) => prv + acc.amount,
            0
          )} DT`,
          icon: <IoCashOutline size={32} />,
          color: "bg-red-100 text-red-600",
        },
      ]);
    }
  }, [
    users.responseData,
    reservations.responseData,
    payments.responseData,
    orders.responseData,
  ]);

  const pieChartData = {
    labels: categories.responseData?.map((category: Category) => category.categoryName),
    datasets: [
      {
        data: categories.responseData?.map((category: Category) => category.menus?.length),
        backgroundColor: categories.responseData?.map((category: Category) => category.color),
        borderColor: categories.responseData?.map((category: Category) => category.color),
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: categories.responseData?.map((category: Category) => category.categoryName),
    datasets: [
      {
        label: 'Number of Items',
        data: categories.responseData?.map((category: Category) => category.menus?.length),
        backgroundColor: categories.responseData?.map((category: Category) => category.color),
        borderColor: categories.responseData?.map((category: Category) => category.color),
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Menu Categories Distribution',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Menu Items per Category',
      },
    },
  };
  return (
    <>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4">
        {cardList.map((item, index) => (
          <Card
            shadow="lg"
            key={index}
            isPressable
            onPress={() => console.log(`${item.title} pressed`)}
            className="transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`${item.color} p-4 rounded-full flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {item.data}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 p-4">
        <Card
          shadow="lg"
          className="transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">
              Menu Categories Distribution
            </h4>
            <p className="text-tiny uppercase font-bold">Pie Chart</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="w-full h-[300px]">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </CardBody>
        </Card>

        <Card
          shadow="lg"
          className="transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Menu Items per Category</h4>
            <p className="text-tiny uppercase font-bold">Bar Chart</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="w-full h-[300px]">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
