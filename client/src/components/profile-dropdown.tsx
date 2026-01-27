import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useLogoutUser } from "@/features/auth/hooks/useLogout";
import { useAvatar } from "@/hooks/useAvatar";

export function ProfileDropdown() {
  const {data,user,refetch} = useAvatar();
  const logoutUser = useLogoutUser();
  const signature = user?.username.substring(0, 2).toUpperCase();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full ">
            <Avatar className="h-8 w-8 ">
              <AvatarImage src={data?.downloadUrl} alt="@shadcn" onLoadingStatusChange={(status)=>{
                if(status === "error"){
                  refetch();
                }
              }}/>
              <AvatarFallback className="bg-blue-400 text-white">
                {signature}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">
                {user?.username}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => logoutUser.mutate()}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
