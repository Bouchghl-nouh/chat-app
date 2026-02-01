import RegisterForm from "../components/RegisterForm";
import { Logo } from "@/assets/logo";
import { Link } from "react-router-dom";
import { Users, Globe, Lock } from "lucide-react";

export function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-12 text-white">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-2xl font-bold">Telegram Clone</span>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Join millions<br />of users worldwide.
          </h1>
          <p className="text-xl text-purple-100 max-w-md">
            Create your free account and start connecting today.
          </p>
          
          <div className="grid gap-4 mt-12">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Group Chats</h3>
                <p className="text-purple-100 text-sm">Create groups with up to 200,000 members</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Cross-Platform</h3>
                <p className="text-purple-100 text-sm">Access from any device, anywhere</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Privacy First</h3>
                <p className="text-purple-100 text-sm">Your data stays private and secure</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-purple-200">
          © 2025 Telegram Clone. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold">Telegram Clone</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
            <p className="text-muted-foreground">
              Get started with your free account
            </p>
          </div>

          <RegisterForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              to="../login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
