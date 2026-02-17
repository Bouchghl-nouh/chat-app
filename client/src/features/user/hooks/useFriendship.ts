import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendRequest,
  acceptRequest,
  blockUser,
  unBlockUser,
} from "@/features/user/api/friendship.apis";

function useFriendshipMutation(mutationFn: () => Promise<any>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export const useSendRequest = (id: string) =>
  useFriendshipMutation(() => sendRequest(id));

export const useAcceptRequest = (id: string) =>
  useFriendshipMutation(() => acceptRequest(id));

export const useBlockUser = (id: string) =>
  useFriendshipMutation(() => blockUser(id));

export const useUnblockUser = (id: string) =>
  useFriendshipMutation(() => unBlockUser(id));
