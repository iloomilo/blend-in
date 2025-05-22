export interface User {
  id?: string;
  username: string;
  avatar: number;
}

export type Users = Map<string, User>;
