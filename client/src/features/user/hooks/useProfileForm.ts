import { useState, useEffect } from "react";
import unknownImg from "@/assets/unkown.webp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormSchema,
} from "../validation/updateProfile.schema";
import { type getProfile } from "../types/userProfile";
export function useProfileForm(initialData: getProfile | undefined) {
  const [preview, setPreview] = useState<string>(
    initialData?.avatar || unknownImg,
  );
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      description: initialData?.description ?? "",
      avatar: undefined,
    },
  });
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        avatar: undefined,
      });
      if (initialData.avatar) setPreview(initialData.avatar);
    }
  }, [initialData, form]);
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    form.reset({
      ...initialData,
      avatar: undefined,
    });
    setPreview(initialData?.avatar || unknownImg);
    setFile(null);
    setIsEditing(false);
  };
  return {
    form,
    preview,
    file,
    isEditing,
    handleCancel,
    handleFileChange,
    setIsEditing,
  };
}
