import { loginSchema } from "../validation/login.schema";
import type { LoginFormSchema } from "../validation/login.schema";
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

import PasswordInputWithToggle from "../../../components/PasswordInput";
import { Input } from "@/components/ui/input";
import { useLoginUser } from "../hooks/useLogin"
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });
  const loginUser = useLoginUser();
  const onSubmit = (data: LoginFormSchema) => {
     loginUser.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
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
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button type="button" className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
          </div>
          <PasswordInputWithToggle
            id="password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className={errors.password ? "border-red-500" : ""}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={loginUser.isPending}
      >
        {loginUser.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
export default LoginForm