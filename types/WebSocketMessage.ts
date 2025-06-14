import type { ToastProps } from "@nuxt/ui";
import type { Lobby } from "./Lobby";
import type { LobbyStates } from "./LobbyStates";
import type { User } from "./User";

export type WebSocketMessage =
  | { type: "update-user"; user: User }
  | { type: "update-lobby"; lobby: Lobby }
  | { type: "start-game" }
  | { type: "next-turn" }
  | { type: "decide"; decision: LobbyStates }
  | { type: "vote-user"; peerId: string }
  | { type: 'return-to-home', errorMessage?: string}
  | { type: 'message', message: string , messageType: ToastProps['color']}
  ;
