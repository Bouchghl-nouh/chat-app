import { ThemeToggle } from "@/components/theme-toggle";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <>
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
    </>
  );
}
