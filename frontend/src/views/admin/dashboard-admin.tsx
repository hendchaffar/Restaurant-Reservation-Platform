import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { IoPeopleOutline, IoBusinessOutline, IoTrendingUpOutline, IoTrendingDownOutline } from "react-icons/io5";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useAxios } from '../../hooks/fetch-api.hook';
import { Company } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Dummy data
const dummyData = {
  clients: 1500,
  managers: 50,
  companies: 100,
  topCompany: { name: "TechCorp", sales: 10000 },
  worstCompany: { name: "StruggleCo", sales: 500 },
  companySales: [
    { name: "TechCorp", sales: 10000 },
    { name: "MegaSoft", sales: 8000 },
    { name: "DataGiant", sales: 7500 },
    { name: "CloudMasters", sales: 6000 },
    { name: "StruggleCo", sales: 500 },
  ]
};

interface Card {
  title: string;
  data: any;
  icon: any;
  color: string;
}

export default function DashboardAdmin() {
  const { managers } = useAxios("users", "GET", {}, "managers", true, {
    role: "MANAGER",
  });
  const { clients } = useAxios("users", "GET", {}, "clients", true, {
    role: "CLIENT",
  });
  const { companies } = useAxios("companies", "GET", {}, "companies", true, {
  });
  const { mostsuccessfulcompanies } = useAxios("companies/mostsuccessful", "GET", {}, "mostsuccessfulcompanies", true, {
  });
  const { worstperformancecompanies } = useAxios("companies/worstperformance", "GET", {}, "worstperformancecompanies", true, {
  });
  const [cardList, setCardList] = useState<Card[]>([]);

  

  useEffect(() => {
    if (
      managers.responseData &&
      clients.responseData && 
      companies.responseData &&
      mostsuccessfulcompanies.responseData
    ) {
      setCardList([
        {
          title: "Clients",
          data: clients.responseData.length,
          icon: <IoPeopleOutline size={32} />,
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Managers",
          data: managers.responseData.length,
          icon: <IoPeopleOutline size={32} />,
          color: "bg-green-100 text-green-600",
        },
        {
          title: "Companies",
          data: companies.responseData.length,
          icon: <IoBusinessOutline size={32} />,
          color: "bg-yellow-100 text-yellow-600",
        },
        {
          title: "Top Company",
          data: `${mostsuccessfulcompanies.responseData.name} (${mostsuccessfulcompanies.responseData.orders.reduce((prv:any,acc:any)=>prv+acc.totalPrice,0)} DT)`,
          icon: <IoTrendingUpOutline size={32} />,
          color: "bg-purple-100 text-purple-600",
        },
      ]);
    }
  }, [
    clients.responseData,
    managers.responseData,
    companies.responseData,
    mostsuccessfulcompanies.responseData
  ]);

  const barChartData = {
    labels: (companies.responseData as Company[])?.map(company => company.name),
    datasets: [
      {
        label: 'Orders',
        data: companies.responseData?.map((company:any) => company.orders.length),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Company Orders Comparison',
      },
    },
  };

  const pieChartData = {
    labels: ['Clients', 'Managers'],
    datasets: [
      {
        data: [clients.responseData?.length, managers.responseData?.length],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
        text: 'Distribution of Clients, Managers',
      },
    },
  };

  return (
    <div className="p-4">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cardList.map((item, index) => (
          <Card key={index} className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${item.color} p-4 rounded-full flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.data}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 mb-8">
        <Card className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Company Orders Comparison</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="w-full h-[300px]">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Distribution of Clients, Managers</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="w-full h-[300px]">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 text-red-600 p-4 rounded-full flex items-center justify-center">
              <IoTrendingDownOutline size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Worst Performing Company</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {worstperformancecompanies.responseData?.name} ({worstperformancecompanies.responseData?.orders?.reduce((prv:any,acc:any)=>prv+acc.totalPrice,0)} DT)
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}