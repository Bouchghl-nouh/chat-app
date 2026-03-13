import { useEffect, useState } from "react";
import { Main } from "../../components/layouts/Main";
import ChatListDemo from "./components/ChatList";
import { ThemeProvider } from "@/components/theme-provider";
import { useFriendsList } from "./hooks/useFriendsList";
import type { ChatFriend } from "./types";
import { Outlet } from "react-router";

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
          <Outlet/>
        </section>
      </Main>
    </ThemeProvider>
  );
};

export default Chat;
