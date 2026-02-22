import { useState } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import unknownImg from "@/assets/unkown.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { socket, connectSocket } from "@/socket/socket";
import { useAppSelector } from "@/hooks/redux";
export const NotifDropDown = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const [notifCounter, setNotifCounter] = useState(0);
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
    socket.on("new_notification", (counter) => {
      setNotifCounter((prev) => prev + counter);
    });
    return () => {
      socket.off("new_notification");
    };
  }, []);
  return (
    <div>
      <DropdownMenu>
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
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">
                New Notifications
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                You have 3 new notifications.
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-52 overflow-auto">
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 mr-2 self-center">
                  <AvatarImage src={unknownImg} alt="Notification 1" />
                  <AvatarFallback className="bg-blue-400 text-white">
                    N1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm  leading-none ">
                    friendship request from John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotifDropDown;
