import type { LobbyStates } from "./LobbyStates";
import type { User } from "./User";

export interface Lobby {
  state: LobbyStates;
  users: Record<string, User>;
  createdAt: number;
  owner?: string;
  impostor?: string;
  word?: string;
}
