import { useState } from "react";
import { format } from "date-fns";
import { Main } from "../../components/layouts/Main";
import { conversations} from "./data/chats.json";
import type { ChatUser, Convo } from "./data/chat-types";
import ChatList from "./components/ChatList";
import ChatView from "./components/ChatView";
import { ThemeProvider } from "@/components/theme-provider";

const Chat = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null,
  );

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const currentMessage = selectedUser ? selectedUser.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, "d MMM, yyyy");

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = [];
      }

      // Push the current object to the array
      acc[key].push(obj);

      return acc;
    },
    {},
  ) : null;

  return (
    <ThemeProvider defaultTheme="system" storageKey="telegram-ui-theme">
      <Main fluid fixed>
        <section className="flex h-full gap-8 mt-8">
          <ChatList
            search={search}
            setSearch={setSearch}
            filteredChatList={filteredChatList}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setMobileSelectedUser={setMobileSelectedUser}
          />
          <ChatView
            selectedUser={selectedUser}
            mobileSelectedUser={mobileSelectedUser}
            setMobileSelectedUser={setMobileSelectedUser}
            currentMessage={currentMessage}
          />
        </section>
      </Main>
    </ThemeProvider>
  );
};

export default Chat;
