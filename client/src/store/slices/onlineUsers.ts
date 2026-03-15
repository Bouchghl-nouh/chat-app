import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Friend ={
  id: string;
  username: string;
  avatar?: string;
  isOnline:Boolean|null;
  lastSeen:string;
}
type UserStatusPayload = {
  userId:string,
  timestamp:string,
}
interface PresenceState {
  friendsById: Record<string, Friend>;
  onlineMap: Record<string, boolean|string>; 
}

const initialState: PresenceState = {
  friendsById: {},
  onlineMap: {},
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    // Stores the initial list of friends from your API
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      action.payload.forEach((friend) => {
        state.friendsById[friend.id] = friend;
        if(friend.isOnline){
          state.onlineMap[friend.id] = true;
        }else{
          state.onlineMap[friend.id] = friend.lastSeen;
        }
      });
    },
    userJoined: (state, action: PayloadAction<string>) => {
      state.onlineMap[action.payload] = true;
    },
    userLeft: (state, action: PayloadAction<UserStatusPayload>) => {
       state.onlineMap[action.payload.userId] = action.payload.timestamp; 
    },
  },
});

export const { setFriends, userJoined, userLeft } = presenceSlice.actions;
export default presenceSlice.reducer;
