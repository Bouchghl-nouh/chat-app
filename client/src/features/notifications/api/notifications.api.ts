import { http } from "../../../api/base";
export type Notif = {
  id: string;
  senderId:string,
  username: string;
  avatar: string;
  message: string;
  createdAt: string;
};
export interface notifsList {
  notifs: Array<Notif>;
  total: number;
  page: number;
  pages: number;
}

export const notifications = async (
  page: number,
): Promise<notifsList> => {
  return http.get(
    "/notification/unread",
    {
      page,
      limit: 5,
    },
    undefined,
    false,
  );
};
export const markAsRead = async (notifId: string): Promise<void> => {
  return http.patch(`/notification/read/${notifId}`, undefined, undefined, false);
}