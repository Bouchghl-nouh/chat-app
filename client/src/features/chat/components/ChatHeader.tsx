import React from 'react'
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChatUser } from "../data/chat-types";

interface ChatHeaderProps {
  selectedUser: ChatUser;
  setMobileSelectedUser: (user: ChatUser | null) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  setMobileSelectedUser,
}) => {
  return (
    <div className="bg-card mb-1 flex flex-none justify-between p-4 shadow-lg sm:rounded-t-md">
      <div className="flex gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="-ms-2 h-full sm:hidden"
          onClick={() => setMobileSelectedUser(null)}
        >
          <ArrowLeft className="rtl:rotate-180" />
        </Button>
        <div className="flex items-center gap-2 lg:gap-4">
          <Avatar className="size-9 lg:size-11">
            <AvatarImage
              src={selectedUser.profile}
              alt={selectedUser.username}
            />
            <AvatarFallback>{selectedUser.username}</AvatarFallback>
          </Avatar>
          <div>
            <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
              {selectedUser.fullName}
            </span>
            <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
              {selectedUser.title}
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
  )
}

export default ChatHeader