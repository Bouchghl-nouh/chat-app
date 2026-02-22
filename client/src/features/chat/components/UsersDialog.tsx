import { useState, useEffect } from "react";
import unknownImg from "@/assets/unkown.webp";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import type {User} from "../types";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsersList } from "../hooks/useUsersList";
import { useDebounce } from "@/hooks/useDebounce";
export default function UsersDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [search, setSearch] = useState("");
  const { isDebouncing, debounceValue } = useDebounce(search, 500);
  const { data, error, fetchNextPage, hasNextPage } = useUsersList(debounceValue);
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  return (
    <div className="flex flex-col gap-4">
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-[700px] w-[90vw]"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={setSearch}
          />
          <CommandList>
            {error && <CommandEmpty> {error.message}</CommandEmpty>}
            {isDebouncing && <CommandEmpty> Loading...</CommandEmpty>}
            {!isDebouncing && !error && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {data?.pages.map((page) => {
                    return page.users.map((user: User) => (
                      <CommandItem key={user.id} onSelect={()=> navigate("profile/"+user.id)}>
                        <Avatar className="size-8 mr-2">
                          <AvatarImage
                            src={user.avatar || unknownImg}
                            alt={user.username}
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            {user.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-md font-medium leading-none">
                            {user.username}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                      </CommandItem>
                    ));
                  })}
                  {hasNextPage && (
                    <div className="flex justify-center" ref={ref}>
                      {" "}
                      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                    </div>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
