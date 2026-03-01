import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "@/features/notifications/api/notifications.api";

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notifId:string) => markAsRead(notifId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
