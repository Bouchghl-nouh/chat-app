import { registerSchema } from "../validation/register.schema";
import type { RegisterFormSchema } from "../validation/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";

import PasswordInputWithToggle from "@/components/PasswordInput";
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
    const {confirmPassword,...payload} = data;
    registerUser.mutate(payload);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Full Name</FieldLabel>
          <Input
            id="username"
            placeholder="John Doe"
            className={errors.username ? "border-red-500" : ""}
            {...register("username")}
          />
          {errors.username && <FieldError>{errors.username.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            placeholder="you@example.com"
            className={errors.email ? "border-red-500" : ""}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInputWithToggle
            id="password"
            placeholder="Create a password"
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
            placeholder="Confirm your password"
            aria-invalid={!!errors.confirmPassword}
            className={errors.confirmPassword ? "border-red-500" : ""}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <button type="button" className="underline hover:text-foreground">Terms of Service</button>
        {" "}and{" "}
        <button type="button" className="underline hover:text-foreground">Privacy Policy</button>
      </p>
    </form>
  );
}
export default RegisterForm