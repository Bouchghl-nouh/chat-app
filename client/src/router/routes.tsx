import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import { authRoutes } from "../features/auth/routes.tsx";
import Dashboard from "../features/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import { RootLayout } from "@/components/RootLayout.tsx";
export const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
    ],
  },
]);

export default routes;
