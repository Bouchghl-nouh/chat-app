import {useState} from "react";
import {MessagesSquare} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UsersDialog  from "./UsersDialog";
const Default = () => {
  const [open,setOpen] = useState(false);

  return (
    <div
        className={cn(
          "bg-card absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs sm:static sm:z-auto sm:flex",
        )}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="border-border flex size-16 items-center justify-center rounded-full border-2">
            <MessagesSquare className="size-8" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-semibold">Users</h1>
            <p className="text-muted-foreground text-sm">
              Connect with other users and start chatting!
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>Show Users</Button>
        </div>
        <UsersDialog open={open} setOpen={setOpen} />
      </div>
  )
}

export default Default