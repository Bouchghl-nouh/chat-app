import { http } from "@/api/base";

export const sendRequest = async (id:string) => {
  return http.post(`/user/friendship/${id}`);
};
export const acceptRequest = async(id:string)=>{
    return http.patch(`/user/me/friendship/accept/${id}`);
}
export const blockUser = async(id:string)=>{
    return http.patch(`/user/me/friendship/block/${id}`);
}
export const unBlockUser = async(id:string)=>{
    return http.patch(`/user/me/friendship/unblock/${id}`);
}
