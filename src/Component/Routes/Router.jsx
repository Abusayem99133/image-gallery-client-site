import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Home from "../HomePage/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: "",
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);
