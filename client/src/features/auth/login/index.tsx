import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginForm from "../components/LoginForm";
import AuthLayout from "../authLayout";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
export function LoginPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to 
            log into your account
            <br />
            you don't have an account? <Link to="../register" className="underline underline-offset-2">Register</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <Footer />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
export default LoginPage;
