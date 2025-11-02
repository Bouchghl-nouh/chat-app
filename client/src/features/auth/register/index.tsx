import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RegisterForm from "../components/RegisterForm";
import AuthLayout from "../authLayout";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
export function RegisterPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create to your account
            <br />
            Already have an account? <Link to="../login" className="underline underline-offset-2">Log in</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <Footer />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
export default RegisterPage;
