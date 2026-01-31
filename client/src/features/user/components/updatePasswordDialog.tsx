import type { updatePasswordSchema } from "../validation/updatePassword.schema";
import { changePasswordSchema } from "../validation/updatePassword.schema";
import { Loader2, X, Check } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInputWithToggle from "@/components/PasswordInput";
import { useUpdatePassword } from "@/features/user/hooks/useUpdatePassword";
type Props = {
  onSuccess: () => void;
};
const ChangePasswordDialog = ({ onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<updatePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const updatePassword = useUpdatePassword();
  const handleClose = () => {
    onSuccess();
    reset();
  };
  const onSubmit = (data: updatePasswordSchema) => {
    const { confirmPassword, ...payload } = data;
    updatePassword.mutate(payload, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form id="changePassword-form" onSubmit={handleSubmit(onSubmit)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>change Password</DialogTitle>
        </DialogHeader>
        <FieldGroup className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="oldPassword">Old Password</FieldLabel>
            <PasswordInputWithToggle
              id="oldPassword"
              placeholder="Enter your old Password"
              aria-invalid={!!errors.oldPassword}
              className={errors.oldPassword ? "border-red-500" : ""}
              {...register("oldPassword")}
            />
            {errors.oldPassword && (
              <FieldError>{errors.oldPassword.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInputWithToggle
              id="password"
              placeholder="Enter your new password"
              aria-invalid={!!errors.password}
              className={errors.password ? "border-red-500" : ""}
              {...register("password")}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordInputWithToggle
              id="confirmPassword"
              placeholder="Confirm your new password"
              aria-invalid={!!errors.confirmPassword}
              className={errors.confirmPassword ? "border-red-500" : ""}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="changePassword-form"
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
};

export default ChangePasswordDialog;
