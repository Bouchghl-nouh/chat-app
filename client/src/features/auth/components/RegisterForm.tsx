import { registerSchema } from "../validation/register.schema";
import type { RegisterFormSchema } from "../validation/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import PasswordInputWithToggle from "./PasswordInput";
import { Input } from "@/components/ui/input";
import { useRegisterUser } from "../hooks/useRegister";
export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
  });
  const registerUser = useRegisterUser();
  const onSubmit = (data: RegisterFormSchema) => {
    registerUser.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Full Name</FieldLabel>
          <Input
            id="username"
            placeholder="John Doe"
            sizeVariant="sm"
            className={errors.username ? "border-red-500" : ""}
            {...register("username")}
          />
          {errors.username && <FieldError>{errors.username.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            placeholder="m@example.com"
            sizeVariant="sm"
            className={errors.email ? "border-red-500" : ""}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInputWithToggle
            id="password"
            placeholder="********"
            sizeVariant="sm"
            aria-invalid={!!errors.password} // for screen readers
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
            placeholder="********"
            sizeVariant="sm"
            aria-invalid={!!errors.confirmPassword} // for screen readers
            className={errors.confirmPassword ? "border-red-500" : ""}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      <CardFooter className="flex-col gap-2 mt-4">
        <Button type="submit" className="w-full" disabled={registerUser.isPending}>
          Create Account
        </Button>
      </CardFooter>
    </form>
  );
}
export default RegisterForm