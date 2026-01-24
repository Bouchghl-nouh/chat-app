import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileDropdown } from "../profile-dropdown";
import { Outlet } from "react-router";
import { useAppSelector } from "@/hooks/redux";
export function RootLayout() {
  const user = useAppSelector((state) => state.user);
  return (
    <div className="h-screen flex flex-col">
      <div className="absolute self-end px-4 py-2 ">
        <div className="flex gap-4 items-center">
        <ThemeToggle />
        {user?.accessToken && <ProfileDropdown />}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
