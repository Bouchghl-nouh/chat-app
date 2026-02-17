import { createBrowserRouter } from "react-router";
import { authRoutes } from "../features/auth/routes.tsx";
import Chat from "../features/chat/index.tsx";
import User from "../features/user/profile/index.tsx"
import UserProfile from "../features/user/UserProfile/index.tsx";
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
          {
            path:"/profile",
            element:<User/>,
          },
          {
            path:"/profile/:id",
            element:<UserProfile/>,
          }
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
