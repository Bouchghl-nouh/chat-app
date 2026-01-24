import unknown from "../../../assets/unkown.webp";
import { profileSchema } from "../validation/updateProfile.schema";
import type { ProfileFormSchema } from "../validation/updateProfile.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IconImage } from "@/assets/brand-icons/icon-picture";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import ProfileFormSkeleton from "./profileFormSkelton";
const ProfileForm = () => {
  const [preview, setPreview] = useState<string>(unknown);
  const [file, setFile] = useState<File | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
  });
  const { data, isLoading, isError, error } = useMyProfile();
  useEffect(() => {
    if (data) {
      reset({
        username: data.username || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      });
    }
    if (data?.avatar) {
      setPreview(data.avatar);
    }
  }, [data, reset]);
  const updateProfile = useUpdateProfile();
  const onSubmit = (data: ProfileFormSchema) => {
    const sendData = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar:file ? file.name : undefined,
    }
    updateProfile.mutate({data:sendData,file});
    setEdit(false);
  };
  const handleCancel = () => {
    if (data) {
      reset({
        username: data.username || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      });
      setPreview(data.avatar);
      setFile(null);
    }
    setEdit(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    return()=>{
      if(preview.startsWith("blob:")){
        URL.revokeObjectURL(preview);
      }
    }
  },[preview]);
  if (isLoading) return <ProfileFormSkeleton />;
  if (isError) return <div>Error: {error?.message}</div>;
  return (
    <form className="space-y-4 p-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center">
        <div className="relative group w-44 h-44">
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-2 border-gray-200"
          />
          {edit && (
            <label
              htmlFor="avatar"
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <IconImage />
              <span className="text-sm font-medium mt-1">Edit</span>
            </label>
          )}

          <input
            id="avatar"
            type="file"
            className="hidden"
            accept="image/*"
            disabled={!edit}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <FieldGroup className="grid grid-cols-8 gap-4">
        <Field className="col-span-4">
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            placeholder={`${data?.email ?? "example@gmail.com"}`}
            disabled
          />
        </Field>
        <Field className="col-span-4">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="Enter Your username"
            className={errors.username ? "border-red-500" : ""}
            disabled={!edit}
            {...register("username")}
          />
          {errors.username && (
            <FieldError>{errors.username.message}</FieldError>
          )}
        </Field>
        <Field className="col-span-4">
          <FieldLabel htmlFor="firstName">FirstName</FieldLabel>
          <Input
            id="firstName"
            placeholder="Enter your FirstName"
            className={errors.firstName ? "border-red-500" : ""}
            disabled={!edit}
            {...register("firstName")}
          />
          {errors.firstName && (
            <FieldError>{errors.firstName.message}</FieldError>
          )}
        </Field>
        <Field className="col-span-4">
          <FieldLabel htmlFor="lastName">LastName</FieldLabel>
          <Input
            id="lastName"
            placeholder="Enter your LastName"
            className={errors.lastName ? "border-red-500" : ""}
            disabled={!edit}
            {...register("lastName")}
          />
          {errors.lastName && (
            <FieldError>{errors.lastName.message}</FieldError>
          )}
        </Field>
         {/* <Field className="col-span-8 ">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            placeholder="description"
            className={`min-h-25 max-h-30 ${errors.description ? "border-red-500" : ""}`}
            disabled={!edit}
            {...register("description")}
          />
          {errors.description && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>  */}
      </FieldGroup>
      <div className="flex justify-end gap-4">
        {edit ? (
          <>
            <Button type="button" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => setEdit((prev) => !prev)}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
