import { Check, Clock, UserCheck, UserPlus, UserX } from "lucide-react";
import type{ UseMutationResult } from '@tanstack/react-query';

type MutationHook = UseMutationResult<any, any, void, any>;
type FriendshipActions = {
  sendRequest: MutationHook;
  acceptRequest: MutationHook;
  blockUser: MutationHook;
  unblockUser: MutationHook;
};

export default function getFriendButtonConfig(status: string | undefined,actions:FriendshipActions) {
  switch (status) {
    case "pending_sent":
      return {
        text: "Request Sent",
        variant: "outline" as const,
        disabled: true,
        icon: <Clock className="w-4 h-4" />,
        action:undefined
      };
    case "pending_received":
      return {
        text: "Accept Request",
        variant: "default" as const,
        disabled: false,
        icon: <UserCheck className="w-4 h-4" />,
        action:actions.acceptRequest
      };
    case "accepted":
      return {
        text: "Friends",
        variant: "secondary" as const,
        disabled: true,
        icon: <Check className="w-4 h-4" />,
        action:undefined
      };
    case "blocked":
      return {
        text: "Blocked",
        variant: "destructive" as const,
        disabled: true,
        icon: <UserX className="w-4 h-4" />,
        action:undefined
      };
    case "unBlock":
      return {
        text: "unBlock",
        variant: "default" as const,
        disabled: false,
        icon: <UserX className="w-4 h-4" />,
        action:actions.unblockUser
      };
    case "block":
      return {
        text: "Block",
        variant: "destructive" as const,
        disabled: false,
        icon: <UserX className="w-4 h-4" />,
        action:actions.blockUser
      };
    default:
      return {
        text: "+ Add Friend",
        variant: "default" as const,
        disabled: false,
        icon: <UserPlus className="w-4 h-4" />,
        action:actions.sendRequest
      };
  }
}
