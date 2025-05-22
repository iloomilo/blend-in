// gameStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWebSocket, type UseWebSocketReturn } from "@vueuse/core";
import type { Lobby } from "~/types/Lobby";
import type { User } from "~/types/User";
import type { WebSocketMessage } from "~/types/WebsocketMessage";

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
    return url.toString();
  }

  watch(
    () => socket.value?.data,
    (newValue) => {
      try {
        if (!newValue) return;
        const data: WebSocketMessage = JSON.parse(newValue);
        console.log("hey", data);
        // todo maybe refactor this to a reflection map
        switch (data.type) {
          case "update-user":
            userStore.setUser(data.user);
            break;
          case "update-lobby":
            lobby.value = data.lobby;
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
  };
});
