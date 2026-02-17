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