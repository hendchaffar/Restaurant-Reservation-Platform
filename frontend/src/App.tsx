import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import useDarkMode from "use-dark-mode";
import Header from "./components/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/routes";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

function App() {
  const darkMode = useDarkMode(false, { global: window });

  return (
    <>
      <NextUIProvider>
        <main
          className={`${
            darkMode.value ? "dark" : ""
          } text-foreground bg-background`}
        >
          <BrowserRouter>
            <ToastContainer />
            <AppRoutes />
          </BrowserRouter>
        </main>
      </NextUIProvider>
    </>
  );
}

export default App;
