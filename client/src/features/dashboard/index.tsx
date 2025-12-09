import { useAppSelector } from "@/hooks/redux";
import { Link } from "react-router-dom";
import { useProfile } from "./hooks/useDashbaord";import { Button } from "@/components/ui/button";
import { useLogoutUser } from "./hooks/useLogout";
const Dashboard = () => {
  const logout = useLogoutUser();
  const handleLogout = () => {
    logout.mutate();
  };
  const user = useAppSelector((state) => state.user);
  const { data: profileData } = useProfile();
  console.log("profile data", profileData);
  console.log("hello", user);
  return (
    <div className="m-4">
      <Button onClick={handleLogout} disabled={logout.isPending}>logout</Button>
      <br />
      <Link to={"/"}>to app </Link>
    </div>
  );
};

export default Dashboard;
