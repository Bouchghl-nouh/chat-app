import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  username:string,
  accessToken:string
}

const initialState: UserState = {
  username:"",
  accessToken :""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.username = "";
      state.accessToken = "";
    },
  },
})


export const { setCredentials, setAccessToken, clearCredentials } = userSlice.actions

export default userSlice.reducer