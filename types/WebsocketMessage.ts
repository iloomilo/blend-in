import type { Lobby } from "./Lobby";
import type { LobbyStates } from "./LobbyStates";
import type { User } from "./User";

export type WebSocketMessage =
  | { type: "update-user"; user: User }
  | { type: "start-game" }
  | { type: "next-turn" }
  | { type: "decide"; decision: LobbyStates }
  | { type: "update-lobby"; lobby: Lobby };
