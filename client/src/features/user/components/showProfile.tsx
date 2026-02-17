import { useState, useMemo } from "react";
import { User, FileText } from "lucide-react";
import type { ProfileFormSchema } from "../validation/updateProfile.schema";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "../hooks/useDisplayProfile";
import { useProfileForm } from "../hooks/useProfileForm";
import DisplayProfileSkelton from "./showProfileSkelton";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import getFriendButtonConfig from "../utils/friendButtonConfig";
import {
  useSendRequest,
  useAcceptRequest,
  useBlockUser,
  useUnblockUser,
} from "../hooks/useFriendship";

const inputClasses = (error?: any) =>
  cn(
    "w-full px-4 py-2.5 border rounded-lg transition-all text-sm",
    error && "border-red-500 focus:border-red-500 focus:ring-red-100",
  );

const ShowProfile = () => {
  const id = useParams().id ?? "";
  const { data, isLoading, isError, error } = useUserProfile(id as string);
  const { form, preview, handleFileChange } = useProfileForm(data);
  const sendRequest = useSendRequest(id);
  const acceptRequest = useAcceptRequest(id);
  const blockUser = useBlockUser(id);
  const unblockUser = useUnblockUser(id);
  const blockButton = getFriendButtonConfig("block", {
    sendRequest,
    acceptRequest,
    blockUser,
    unblockUser,
  });
  const unBlockButton = getFriendButtonConfig("unBlock", {
    sendRequest,
    acceptRequest,
    blockUser,
    unblockUser,
  });
  const buttonConfig = useMemo(
    () =>
      getFriendButtonConfig(data?.status, {
        sendRequest,
        acceptRequest,
        blockUser,
        unblockUser,
      }),
    [data?.status],
  );

  if (isLoading) return <DisplayProfileSkelton />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <>
      <div className="rounded-xl shadow-md border border-slate-200 p-4 mt-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="relative group">
              <div className="relative w-20 h-20 sm:w-32 sm:h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br  p-0.5">
                  <div className="w-full h-full rounded-full bg-white p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <input
                  id="avatar"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-slate-900">
                {data?.username} Profile
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {data?.status === "accepted" && (
              <Button
                variant={blockButton.variant}
                disabled={blockButton.disabled}
                onClick={() => blockButton.action?.mutate()}
              >
                {blockButton.icon}
                {blockButton.text}
              </Button>
            )}
            <Button
              variant={buttonConfig.variant}
              disabled={buttonConfig.disabled}
              onClick={() => buttonConfig.action?.mutate()}
            >
              {buttonConfig.icon}
              {buttonConfig.text}
            </Button>
            {data?.status === "blocked" && data?.canUnBlock && (
              <Button
                variant={unBlockButton.variant}
                disabled={unBlockButton.disabled}
                onClick={() => unBlockButton.action?.mutate()}
              >
                {unBlockButton.icon}
                {unBlockButton.text}
              </Button>
            )}
          </div>
        </div>
        <form>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {["username", "firstName", "lastName"].map((field) => (
              <Field key={field}>
                <FieldLabel
                  htmlFor={field}
                  className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> {field}
                </FieldLabel>
                <Input
                  id={field}
                  placeholder={field}
                  disabled
                  className={inputClasses(
                    form.formState.errors[field as keyof ProfileFormSchema],
                  )}
                  {...form.register(field as keyof ProfileFormSchema)}
                />
              </Field>
            ))}

            <Field className="lg:col-span-2">
              <FieldLabel
                htmlFor="description"
                className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-violet-600" />
                Bio
              </FieldLabel>
              <Textarea
                id="description"
                placeholder="description"
                disabled
                rows={10}
                className={cn(
                  inputClasses(form.formState.errors.description),
                  "max-h-30",
                )}
                {...form.register("description")}
              />
            </Field>
          </FieldGroup>
        </form>
      </div>
    </>
  );
};

export default ShowProfile;
