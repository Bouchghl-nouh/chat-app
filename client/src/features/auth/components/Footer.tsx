import { Button } from "@/components/ui/button";
import { IconFacebook, IconGithub } from "@/assets/brand-icons";
import {Link} from "react-router-dom"
export function Footer() {
  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          //disabled={isLoading}
        >
          <IconGithub className="h-4 w-4" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          //disabled={isLoading}
        >
          <IconFacebook className="h-4 w-4" /> Facebook
        </Button>
      </div>
      <div className="mt-2">
        <p className="text-muted-foreground px-8 text-center text-sm">
          By creating an account, you agree to our{" "}
          <Link
            to=""
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to=""
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
export default Footer;
