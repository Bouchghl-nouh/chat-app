import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import { authRoutes } from "../features/auth/routes.tsx";
import Dashboard from "../features/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
export const routes = createBrowserRouter([
  ...authRoutes,
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>Not found</h1>,
  },
]);

export default routes;
