import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsRead } from "@/features/notifications/api/notifications.api";

export function useReadAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
