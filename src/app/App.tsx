import { ROUTES } from "@/feature/router";
import { StagePage } from "@/page/StagePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

let router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <StagePage />,
    errorElement: <p className="font-bold">Что-то пошло не так.</p>,
  },
]);
export const App = () => {
  return (
    <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
  );
};
