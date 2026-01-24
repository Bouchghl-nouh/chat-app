import { updateProfile } from "../api/updateProfile.api";
import { uploadFileToUrl } from "@/api/upload.api";
import type { myProfile } from "@/features/user/types/userProfile";

export const updateProfileWithUpload = async (data: myProfile,file:File|null )=>{
   try {
        const res = await updateProfile(data);
        if (res?.uploadUrl && file) {
            const uploadUrl = res?.uploadUrl;
            await uploadFileToUrl(uploadUrl, file);
        }
        return res;

    } catch (error) {
        console.error("Error in updateProfileWithUpload:", error);
        throw error;
    }
}   