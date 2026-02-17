import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileWithUpload } from "@/features/user/services/updateProfileWithUpload";
import type { userProfile } from "@/features/user/types/userProfile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, file }: { data: userProfile; file: File | null }) =>
      updateProfileWithUpload(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
