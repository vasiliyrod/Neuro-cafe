import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import Statistics from "./pages/Statistics";
import Messaging from "./pages/Messaging";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="statistics" replace /> },
  { path: "/statistics", element: <Statistics /> },
  { path: "/messaging", element: <Messaging /> },
  { path: "/menu", element: <Menu /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
