import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage,AvatarBadge } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChatFriend } from "../types";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/hooks/redux";
interface ChatHeaderProps {
  user: ChatFriend;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const onlineMap = useAppSelector((state) => state.presence.onlineMap);
  const status = onlineMap[user.id];
  const getStatusText = () => {
    if (status === true) return "online";
    if (typeof status === "string")
      return `last seen ${formatDistanceToNow(status, { addSuffix: true })}`;
    return "offline";
  };
  return (
    <div className="bg-card mb-1 flex flex-none justify-between p-4 shadow-lg sm:rounded-t-md">
      <div className="flex gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="-ms-2 h-full sm:hidden"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="rtl:rotate-180" />
        </Button>
        <div className="flex items-center gap-2 lg:gap-4">
          <Avatar className="size-13 lg:size-13 ">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            <AvatarBadge status={status===true?"online":"offline"}/>
          </Avatar>
          <div>
            <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
              {user.username}
            </span>
            <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="-me-1 flex items-center gap-1 lg:gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
        >
          <Video size={22} className="stroke-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
        >
          <Phone size={22} className="stroke-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
        >
          <MoreVertical className="stroke-muted-foreground sm:size-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
