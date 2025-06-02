// gameStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWebSocket, type UseWebSocketReturn } from "@vueuse/core";
import type { Lobby } from "~/types/Lobby";
import type { User } from "~/types/User";
import type { WebSocketMessage } from "~/types/WebSocketMessage";

export const useGameStore = defineStore("game", () => {
  const socket = ref<UseWebSocketReturn<string> | null>(null);
  const lobbyCode = ref<string | null>(null);
  const lobby = ref<Lobby | null>(null);
  const userStore = useUserStore();

  function getConnectUrl(code: string, user: User): string {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const url = new URL(`${protocol}://${host}/api/websocket`);

    url.searchParams.set("lobby", code);
    url.searchParams.set("username", user.username);
    url.searchParams.set("avatar", user.avatar.toString());
    url.searchParams.set("language", user.language ?? "en");
    return url.toString();
  }


  const router = useRouter();
  const toast = useToast();
  watch(
    () => socket.value?.data,
    (newValue) => {
      try {
        if (!newValue) return;
        const data: WebSocketMessage = JSON.parse(newValue);
        // todo maybe refactor this to a reflection map
        switch (data.type) {
          case "update-user":
            userStore.setUser(data.user);
            break;
          case "update-lobby":
            lobby.value = data.lobby;
            break;
          case "return-to-home":
            router.push('/');
            toast.add({
              title: "Error",
              description: data.errorMessage ?? "An error occurred, please try again.",
              color: "error",
            })
          break;
          case 'message':
            toast.add({
              title: data.message,
              color: data.messageType ?? "primary",
            });
            break;
        }
      } catch (e) {
        console.error("error parsing JSON:" + e);
      }
    }
  );

  function connectToLobby(code: string, user: User) {
    if (!socket.value) {
      socket.value = useWebSocket(getConnectUrl(code, user), {
        autoReconnect: true,
      });

      lobbyCode.value = code;
    }
  }

  function startGame() {
    const message = getMessage({
      type: "start-game",
    });
    socket.value?.send(message);
  }

  function resetGame() {
    lobby.value = null;
    lobbyCode.value = null;
    socket.value = null;
  }

  function disconnect() {
    socket.value?.close();
    socket.value = null;
    lobbyCode.value = null;
    lobby.value = null;
  }

  function setLobby(newLobby: Lobby) {
    lobby.value = newLobby;
  }

  return {
    socket,
    lobbyCode,
    lobby,
    connectToLobby,
    disconnect,
    startGame,
    setLobby,
    resetGame,
  };
});
