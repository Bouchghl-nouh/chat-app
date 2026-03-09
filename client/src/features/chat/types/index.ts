export type User = {
   id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}
export interface usersList {
  users: Array<User>;
  total: number;
  page: number;
  pages: number;
}
export type ChatFriend = {
    conversationId:string,
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}
export interface ChatList{
  conversations: Array<ChatFriend>;
  total: number;
  page: number | null;
  pages: number | null;
}