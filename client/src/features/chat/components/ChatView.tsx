import React from "react";
import { Fragment } from "react/jsx-runtime";
import { format } from "date-fns";
import { Paperclip, ImagePlus, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatUser, Convo } from "../data/chat-types";
import ChatHeader from "./ChatHeader";
import Default from "./Default"
interface ChatViewProps {
  selectedUser: ChatUser | null;
  mobileSelectedUser: ChatUser | null;
  setMobileSelectedUser: (user: ChatUser | null) => void;
  currentMessage: Record<string, Convo[]> | null;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedUser,
  mobileSelectedUser,
  setMobileSelectedUser,
  currentMessage,
}) => {
  if (!selectedUser) {
    return (
     <Default />
    );
  }
  return (
    <>
      <div
        className={cn(
          "bg-background absolute inset-0 start-full z-40 hidden w-full flex-1 flex-col border shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md",
          mobileSelectedUser && "start-0 flex",
        )}
      >
        <ChatHeader
          selectedUser={selectedUser}
          setMobileSelectedUser={setMobileSelectedUser}
        />

        {/* Conversation */}
        <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
          <div className="flex size-full flex-1">
            <div className="chat-text-container relative -me-4 flex flex-1 flex-col overflow-y-hidden">
              <div className="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4">
                {currentMessage &&
                  Object.keys(currentMessage).map((key) => (
                    <Fragment key={key}>
                      {currentMessage[key].map((msg, index) => (
                        <div
                          key={`${msg.sender}-${msg.timestamp}-${index}`}
                          className={cn(
                            "chat-box max-w-72 px-3 py-2 break-words shadow-lg",
                            msg.sender === "You"
                              ? "bg-primary/90 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]"
                              : "bg-muted self-start rounded-[16px_16px_16px_0]",
                          )}
                        >
                          {msg.message}{" "}
                          <span
                            className={cn(
                              "text-foreground/75 mt-1 block text-xs font-light italic",
                              msg.sender === "You" &&
                                "text-primary-foreground/85 text-end",
                            )}
                          >
                            {format(msg.timestamp, "h:mm a")}
                          </span>
                        </div>
                      ))}
                      <div className="text-center text-xs">{key}</div>
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
          <form className="flex w-full flex-none gap-2">
            <div className="border-input bg-card focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4">
              <div className="space-x-1">
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-md"
                >
                  <Plus size={20} className="stroke-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="hidden h-8 rounded-md lg:inline-flex"
                >
                  <ImagePlus size={20} className="stroke-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="hidden h-8 rounded-md lg:inline-flex"
                >
                  <Paperclip size={20} className="stroke-muted-foreground" />
                </Button>
              </div>
              <label className="flex-1">
                <span className="sr-only">Chat Text Box</span>
                <input
                  type="text"
                  placeholder="Type your messages..."
                  className="h-8 w-full bg-inherit focus-visible:outline-hidden"
                />
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <Send size={20} />
              </Button>
            </div>
            <Button className="h-full sm:hidden">
              <Send size={18} /> Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatView;
