import { useState } from "react";
import {
  Camera,
  Loader2,
  User,
  Mail,
  FileText,
  X,
  Check,
  Lock,
} from "lucide-react";
import type { ProfileFormSchema } from "../validation/updateProfile.schema";
import { useProfileForm } from "../hooks/useProfileForm";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ChangePasswordDialog from "@/features/user/components/updatePasswordDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import ProfileFormSkeleton from "./profileFormSkelton";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/redux";
import { clearCredentials } from "@/store/slices/userSlice";
const inputClasses = (error?: any) =>
  cn(
    "w-full px-4 py-2.5 border rounded-lg transition-all text-sm",
    error && "border-red-500 focus:border-red-500 focus:ring-red-100",
  );
const ProfileForm = () => {
  const { data, isLoading, isError, error } = useMyProfile();
  const [open, setOpen] = useState(false);
  const updateProfile = useUpdateProfile();
  const {
    form,
    preview,
    file,
    isEditing,
    handleCancel,
    handleFileChange,
    setIsEditing,
  } = useProfileForm(data);
  const dispatch = useAppDispatch();
  const onSubmit = (formData: ProfileFormSchema) => {
    updateProfile.mutate(
      { data: { ...formData, avatar: file?.name }, file },
      {
        onSuccess: () => {
          dispatch(clearCredentials());
          setIsEditing(false);
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          setIsEditing(false);
        },
      },
    );
  };

  if (isLoading) return <ProfileFormSkeleton />;
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

                {isEditing && (
                  <label
                    htmlFor="avatar"
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/75 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm m-1"
                  >
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </label>
                )}

                <input
                  id="avatar"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={!isEditing}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-slate-900">
                Profile Settings
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage your account information
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {!isEditing && (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="hidden lg:flex px-4 py-2 items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Change Password</span>
                    </Button>
                  </DialogTrigger>
                  <ChangePasswordDialog onSuccess={() => setOpen(false)} />
                </Dialog>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </>
            )}
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <Field className="lg:col-span-2">
              <FieldLabel className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Address
              </FieldLabel>
              <Input
                type="email"
                value={data?.email ?? "example@gmail.com"}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed text-sm"
              />
            </Field>

            {["username", "firstName", "lastName"].map((field) => (
              <Field key={field}>
                <FieldLabel className="ext-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> {field}
                </FieldLabel>
                <Input
                  disabled={!isEditing}
                  className={inputClasses(
                    form.formState.errors[field as keyof ProfileFormSchema],
                  )}
                  {...form.register(field as keyof ProfileFormSchema)}
                />
                {form.formState.errors[field as keyof ProfileFormSchema] && (
                  <FieldError className="text-xs text-red-600 mt-1">
                    {
                      form.formState.errors[field as keyof ProfileFormSchema]
                        ?.message
                    }
                  </FieldError>
                )}
              </Field>
            ))}

            <Field className="lg:col-span-2">
              <FieldLabel className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" />
                Bio
              </FieldLabel>
              <Textarea
                placeholder="Tell us about yourself..."
                disabled={!isEditing}
                rows={10}
                className={inputClasses(form.formState.errors.description)}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <FieldError className="text-xs text-red-600 mt-1">
                  {form.formState.errors.description.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex-1 px-6 py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProfileForm;
