import {useState} from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
type PasswordInputWithToggleProps = React.ComponentProps<"input"> & {
  sizeVariant?: "sm" | "md" | "lg" | "xl"
}

export function PasswordInputWithToggle(props: PasswordInputWithToggleProps) {
  const [seePassword, setSeePassword] = useState<boolean>(false);

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type={seePassword ? "text" : "password"}
      />
      <InputGroupAddon align="inline-end">
        {seePassword ? (
          <Eye
            className="cursor-pointer"
            onClick={() => setSeePassword(false)}
          />
        ) : (
          <EyeOff
            className="cursor-pointer"
            onClick={() => setSeePassword(true)}
          />
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}

export default PasswordInputWithToggle ;