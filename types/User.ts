import type { AvailableLanguages } from "./Languages";

export interface User {
  id?: string;
  username: string;
  avatar: number;
  language?: AvailableLanguages; 
}

export type Users = Map<string, User>;
