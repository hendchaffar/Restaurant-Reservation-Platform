import React from "react";
import { Route, Routes } from "react-router-dom";
import UserList from "../views/admin/user-list";
import OrderList from "../views/manager/order-list";
import MenuList from "../views/manager/menu-list";
import ReservationList from "../views/manager/reservation-list";
import Login from "../views/client/login";
import Dashboard from "../views/manager/dashboard";
import Profile from "../views/manager/profile";
import AuthGuard from "../guard/auth-gurad";
import AuthProvider from "../context/app-context";
import LoginGuard from "../guard/login-guard";
import SignUpPage from "../views/client/signup";
import ClientLayout from "../views/client/client-layout";
import MenuCards from "../views/client/menu-cards";
import CategoriesList from "../views/manager/categories";
import Cart from "../views/client/cart";
import OrderPage from "../views/client/order";
import ReservationPage from "../views/client/reservation";
import FoodAndDrinkFinder from "../views/client/places-list";
import CompanyPage from "../views/client/company-page";
import MyCompany from "../views/manager/mycompany";
import CompanyInfo from "../views/client/company-info";
import TablesList from "../views/manager/table-list";
import ChatMessagesClient from "../views/client/chat-message-client";
import ManagerLayout from "../views/manager/manager-layout";
import DashboardAdmin from "../views/admin/dashboard-admin";
import AdminLayout from "../views/admin/admin-layout";
import CompanyList from "../views/admin/company-list";
import { LoadingProvider } from "../context/loader.context";

const AppRoutes = () => {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <LoginGuard>
                <SignUpPage />
              </LoginGuard>
            }
          />
          <Route
            path="*"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />
          <Route path="/places" element={<FoodAndDrinkFinder />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route
            path="/admin"
            element={
              <AuthGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index path="dashboard" element={<DashboardAdmin />} />
            <Route path="users" element={<UserList />} />
            <Route path="profile" element={<Profile />} />

            <Route path="companies" element={<CompanyList />} />

            {/* <Route path="*" element={<DashboardAdmin />} /> */}
          </Route>

          <Route
            path="/manager"
            element={
              <AuthGuard allowedRoles={["MANAGER"]}>
                <ManagerLayout />
              </AuthGuard>
            }
          >
            <Route index path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="reservations" element={<ReservationList />} />
            <Route path="menus" element={<MenuList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="mycompany" element={<MyCompany />} />
            <Route path="tables" element={<TablesList />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
          <Route
            path="/client"
            element={
              <AuthGuard allowedRoles={["CLIENT"]}>
                <ClientLayout />
              </AuthGuard>
            }
          >
            <Route index path="menus" element={<MenuCards />} />
            <Route path="company-info" element={<CompanyInfo />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="reservations" element={<ReservationPage />} />
            <Route path="chat" element={<ChatMessagesClient />} />
            <Route path="*" element={<MenuCards />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default AppRoutes;
