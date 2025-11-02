import { loginSchema } from "../validation/login.schema";
import type { LoginFormSchema } from "../validation/login.schema";
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

import PasswordInputWithToggle from "../components/PasswordInput";
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
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
      </FieldGroup>
      <CardFooter className="flex-col gap-2 mt-4">
        <Button type="submit" className="w-full" disabled={loginUser.isPending}>
          Sign in
        </Button>
      </CardFooter>
    </form>
  );
}
export default LoginForm