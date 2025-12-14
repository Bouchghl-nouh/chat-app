import LoginForm from "../components/LoginForm";
import { Logo } from "@/assets/logo";
import { Link } from "react-router-dom";
import { MessageCircle, Users, Shield, Zap } from "lucide-react";

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-2xl font-bold">Telegram Clone</span>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Connect with anyone,<br />anywhere.
          </h1>
          <p className="text-xl text-blue-100 max-w-md">
            Fast, secure, and powerful messaging for everyone.
          </p>
          
          <div className="grid gap-4 mt-12">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-time Messaging</h3>
                <p className="text-blue-100 text-sm">Instant delivery of your messages</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Private</h3>
                <p className="text-blue-100 text-sm">End-to-end encrypted conversations</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white/10 p-3">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                <p className="text-blue-100 text-sm">Optimized for speed and performance</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-blue-200">
          © 2025 Telegram Clone. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold">Telegram Clone</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to continue to your account
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="../register"
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
