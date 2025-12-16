import { ThemeToggle } from "@/components/theme-toggle";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="h-screen flex flex-col">
      <div className="absolute self-end px-4 py-2">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
}
