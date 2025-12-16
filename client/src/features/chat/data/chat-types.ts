import { type conversations } from './chats.json'

export type ChatUser = (typeof conversations)[number]
export type Convo = ChatUser['messages'][number]
