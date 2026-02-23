import User from "./profile"
import UserProfile from "./UserProfile";

export const userRoutes = [
    {path : "/profile",element:<User />},
    {path:"/profile/:id",element:<UserProfile/>}
]