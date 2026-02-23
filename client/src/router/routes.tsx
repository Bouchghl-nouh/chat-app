import { createBrowserRouter } from "react-router";
import { authRoutes } from "../features/auth/routes.tsx";
import { userRoutes } from "../features/user/routes.tsx";
import Chat from "../features/chat/index.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import { RootLayout } from "@/components/layouts/RootLayout.tsx";
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
            index:true,
            element: <Chat />,
          },
          ...userRoutes
        ],
      },
      {
        path: "*",
        element: <h1 className="flex justify-center items-center h-screen font-extrabold">Not found</h1>,
      },
    ],
  },
]);

export default routes;
