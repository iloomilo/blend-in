import type { Lobby } from "./Lobby";
import type { User } from "./User";

export type WebSocketMessage =
  | { type: "update-user"; user: User }
  | { type: "start-game" }
  | { type: "update-lobby"; lobby: Lobby };
