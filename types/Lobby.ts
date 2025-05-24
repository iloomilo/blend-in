import type { LobbyStates } from "./LobbyStates";
import type { User } from "./User";
import type { ImposterVote } from "./Votes";

export interface Lobby {
  state: LobbyStates;
  users: Record<string, User>;
  createdAt: number;
  owner?: string;
  impostor?: string;
  currentTurnUser?: string;
  firstTurnUser?: string;
  word?: string;
  currentVote?: ImposterVote;
}
