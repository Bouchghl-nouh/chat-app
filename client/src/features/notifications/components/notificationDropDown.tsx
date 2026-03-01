import { useState } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { socket, connectSocket } from "@/socket/socket";
import { useAppSelector } from "@/hooks/redux";
import { useNotifications } from "@/features/notifications/hooks/useNotifs";
import type { Notif } from "@/features/notifications/api/notifications.api";
import { useReadNotification } from "@/features/notifications/hooks/useReadNotif";
export const NotifDropDown = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAppSelector((state) => state.user);
  const { ref, inView } = useInView();
  const [notifCounter, setNotifCounter] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useNotifications();
  const readNotif = useReadNotification();

  useEffect(() => {
    if (!accessToken) return;
    connectSocket(accessToken);
    socket.on("notification", (counter) => {
      setNotifCounter(counter);
    });
    return () => {
      socket.disconnect();
      socket.off("notification");
    };
  }, [accessToken]);
  useEffect(() => {
    socket.on("notification:new", (counter) => {
      setNotifCounter((prev) => prev + counter);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    return () => {
      socket.off("notification:new");
    };
  }, []);
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const handleReadNotif = (profileId: string, notifId: string) => {
    readNotif.mutate(notifId);
    navigate("profile/" + profileId);
  };
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={() => setOpen(!open)}>
        <DropdownMenuTrigger asChild>
          <button className="relative h-10 w-10 rounded-full p-0 flex justify-center items-center hover:bg-accent hover:text-accent-foreground">
            {notifCounter > 0 && (
              <div className="absolute right-0 top-0 min-w-4 px-1 flex items-center justify-center rounded-full bg-rose-700 text-[10px] text-white">
                {notifCounter}
              </div>
            )}
            <Bell size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1.5 justify-between">
                <p className="text-sm leading-none font-medium">
                  New Notifications
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {`You have ${notifCounter} ${notifCounter > 1 ? "new notifications" : "new notification"}`}
                  .
                </p>
              </div>
              <p
                className="cursor-pointer text-blue-500"
                onClick={() => setOpen(!open)}
              >
                mark all read
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-52 overflow-auto">
            {error && (
              <DropdownMenuItem asChild>
                <div className="text-red-600 flex justify-center">
                  {error?.message}
                </div>
              </DropdownMenuItem>
            )}
            {isLoading && (
              <DropdownMenuItem asChild>
                <div className="text-muted-foreground flex justify-center">
                  {" "}
                  <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                </div>
              </DropdownMenuItem>
            )}
            {data?.pages.map((page) =>
              page.notifs.map((notif: Notif) => (
                <DropdownMenuItem key={notif.id} asChild>
                  <div
                    className="flex items-start gap-2"
                    onClick={() => handleReadNotif(notif.senderId, notif.id)}
                  >
                    <Avatar className="h-8 w-8 mr-2 self-center">
                      <AvatarImage src={notif.avatar} alt={notif.username} />
                      <AvatarFallback className="bg-blue-400 text-white">
                        {notif.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm  leading-none ">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )),
            )}
            {hasNextPage && (
              <div className="flex justify-center" ref={ref}>
                {" "}
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
              </div>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotifDropDown;
