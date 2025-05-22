import { defineStore } from "pinia";
import type { User } from "~/types/User";

export const useUserStore = defineStore("user", () => {
  let user = reactive<User>({
    id: "",
    username: "",
    avatar: 0,
  });

  function setUser(newUser: User) {
    Object.assign(user, { ...newUser });
  }

  return {
    user,
    setUser,
  };
});
