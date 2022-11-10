/* eslint-disable react/react-in-jsx-scope */
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Dashboard/Profile";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Mail from "../pages/Mail";
import Register from "../pages/Register";

const routeList = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/Profile',
    element: <Profile />,
  },
  {
    path: '/verification',
    element: <Mail />,
  },
]);

export default routeList;
