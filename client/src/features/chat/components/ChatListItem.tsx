import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux";
import type { ChatFriend } from "../types";

interface ChatListItemProps {
  chatUsr: ChatFriend;
  isSelected: boolean;
  onSelect: () => void;
}
const ChatListItem = ({ chatUsr, isSelected, onSelect }: ChatListItemProps) => {
  const onlineMap = useAppSelector((state) => state.presence.onlineMap);
  const { id, avatar, username } = chatUsr;
  const status = onlineMap[id];
  return (
    <>
      <button
        type="button"
        className={cn(
          "group hover:bg-accent hover:text-accent-foreground",
          `flex w-full rounded-md px-2 py-2 text-start text-sm`,
          isSelected && "sm:bg-muted",
        )}
        onClick={onSelect}
      >
        <div className="flex gap-2">
          <Avatar size="lg">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="bg-blue-400 text-white">
              {username.charAt(0)}
            </AvatarFallback>
            <AvatarBadge status={status === true ? "online" : "offline"} />
          </Avatar>
          <div>
            <span className="col-start-2 row-span-2 font-medium">
              {username}
            </span>
            <span className="text-muted-foreground group-hover:text-accent-foreground/90 col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis">
              hello world
            </span>
          </div>
        </div>
      </button>
      <Separator className="my-1" />
    </>
  );
};

export default ChatListItem;
