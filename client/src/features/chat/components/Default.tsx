import {MessagesSquare} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const Default = () => {
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
            <h1 className="text-xl font-semibold">Your messages</h1>
            <p className="text-muted-foreground text-sm">
              Send a message to start a chat.
            </p>
          </div>
          <Button>Send message</Button>
        </div>
      </div>
  )
}

export default Default