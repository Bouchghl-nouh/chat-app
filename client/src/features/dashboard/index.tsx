import { useAppSelector } from "@/hooks/redux";
import { Link } from "react-router-dom";
import { useProfile } from "./hooks/useDashbaord";
const Dashboard = () => {
  const user = useAppSelector((state) => state.user);
  const { data: profileData } = useProfile();
  console.log("profile data", profileData);
  console.log("hello", user);
  return <Link to={"/"}>to app </Link>;
};

export default Dashboard;
