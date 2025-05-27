import { defineStore } from "pinia";
import type { AvailableLanguages } from "~/types/Languages";
import type { User } from "~/types/User";

export const useUserStore = defineStore("user", () => {
  let user = reactive<User>({
    id: "",
    username: "",
    avatar: 0,
    language: "de"
  });

  function setUser(newUser: User) {
    Object.assign(user, { ...newUser });
  }

  function setLanguage(newLanguage: AvailableLanguages) {
    user.language = newLanguage;
  }

  function resetUser() {
    user.avatar = 0;
    user.id = "";
    user.username = "";
  }

  return {
    user,
    setUser,
    resetUser,
    setLanguage
    
  };
});
