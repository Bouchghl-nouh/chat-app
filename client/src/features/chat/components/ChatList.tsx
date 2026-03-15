import React from "react";
import { Search as SearchIcon, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatList, ChatFriend } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import ChatListItem from "./ChatListItem";
interface ChatListProps {
  search: string;
  setSearch: (value: string) => void;
  filteredChatList: ChatList["conversations"];
  selectedUser: ChatFriend | null;
  setSelectedUser: (user: ChatFriend | null) => void;
  setMobileSelectedUser: (user: ChatFriend | null) => void;
}

const ChatListDemo: React.FC<ChatListProps> = ({
  search,
  setSearch,
  filteredChatList,
}) => {
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
      <div className="bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <h1 className="text-2xl font-bold">Inbox</h1>
            <MessagesSquare size={20} />
          </div>
        </div>

        <label
          className={cn(
            "focus-within:ring-ring focus-within:ring-1 focus-within:outline-hidden",
            "border-border flex h-10 w-full items-center space-x-0 rounded-md border ps-2",
          )}
        >
          <SearchIcon size={15} className="me-2 stroke-slate-500" />
          <span className="sr-only">Search</span>
          <input
            type="text"
            className="w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden"
            placeholder="Search chat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <ScrollArea className="-mx-3 h-full overflow-scroll p-3">
        {filteredChatList.map((chatUsr) => {
          // const lastConvo = messages[0];
          // const lastMsg =
          //   lastConvo.sender === "You"
          //     ? `You: ${lastConvo.message}`
          //     : lastConvo.message;
          return (
            <ChatListItem
              key={chatUsr.conversationId}
              chatUsr={chatUsr}
              isSelected={params.is === chatUsr.conversationId}
              onSelect={() =>
                navigate(`/chat/${chatUsr.conversationId}`, {
                  state: { user: chatUsr },
                })
              }
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default ChatListDemo;
