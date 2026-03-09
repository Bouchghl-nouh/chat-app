import { useEffect, useState } from "react";
import { Main } from "../../components/layouts/Main";
import ChatListDemo from "./components/ChatList";
import ChatView from "./components/ChatView";
import { ThemeProvider } from "@/components/theme-provider";
import { useFriendsList } from "./hooks/useFriendsList";
import type { ChatFriend } from "./types";

const Chat = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatFriend | null>(null);
  const [filteredChatList, setFilteredChatList] = useState<ChatFriend[]>([]);
  const [mobileSelectedUser, setMobileSelectedUser] =
    useState<ChatFriend | null>(null);
  const { data, isLoading, error } = useFriendsList();

  useEffect(() => {
    if (data) {
      const filteredData = data.conversations.filter(({ username }) =>
        username.toLowerCase().includes(search.trim().toLowerCase()),
      );
      setFilteredChatList(filteredData);
    }
  }, [search, data]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="telegram-ui-theme">
      <Main fluid fixed>
        <section className="flex h-full gap-8 mt-8">
          {!isLoading && (
            <ChatListDemo
              search={search}
              setSearch={setSearch}
              filteredChatList={filteredChatList}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setMobileSelectedUser={setMobileSelectedUser}
            />
          )}
          <ChatView
            selectedUser={selectedUser}
            mobileSelectedUser={mobileSelectedUser}
            setMobileSelectedUser={setMobileSelectedUser}
            currentMessage={{
              messages: [
                {
                  sender: "Matt",
                  message: "Sure thing, I'll send over the updates shortly.",
                  timestamp: "2024-08-23T10:25:00",
                },
                {
                  sender: "You",
                  message: "Could you update the backend as well?",
                  timestamp: "2024-08-23T10:23:00",
                },
                {
                  sender: "Matt",
                  message: "The frontend updates are done. How does it look?",
                  timestamp: "2024-08-23T10:20:00",
                },
              ],
            }}
          />
        </section>
      </Main>
    </ThemeProvider>
  );
};

export default Chat;
