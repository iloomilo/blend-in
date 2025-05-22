import { Lobby } from "~/types/Lobby";
import { LobbyStates } from "~/types/LobbyStates";
import { User } from "~/types/User";
import { WebSocketMessage } from "~/types/WebsocketMessage";
import { createGameCode, getRandomUsername } from "~/utils/lobbyUtil";
import { getMessage } from "~/utils/messageUtil";

const lobbies = new Map<string, Lobby>();

function getUrlData(urlString: string): { lobbyCode: string; user: User } {
  const url = new URL(urlString);
  let avatar = Number(url.searchParams.get("avatar") ?? 0);
  let lobbyCode = url.searchParams.get("lobby") || createGameCode();
  let username = url.searchParams.get("username") || getRandomUsername();

  if (isNaN(avatar)) {
    avatar = 0;
  }

  const user: User = {
    username: username,
    avatar: avatar,
  };

  return {
    lobbyCode,
    user,
  };
}

function createLobby(): Lobby {
  return {
    state: LobbyStates.PRE_LOBBY,
    users: {},
    createdAt: Date.now(),
  };
}

function getLobbyByPeerId(
  peerId: string
): { lobby: Lobby; lobbyCode: string } | null {
  for (const [lobbyCode, lobby] of lobbies.entries()) {
    for (const userPeerId in lobby.users) {
      if (peerId === userPeerId) {
        return { lobby, lobbyCode };
      }
    }
  }
  return null;
}

function getImpostor(lobby: Lobby): string | null {
  const userIds = Object.keys(lobby.users);
  if (userIds.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * userIds.length);
  const impostorId = userIds[randomIndex];

  return lobby.users[impostorId]?.id ?? null;
}

function getRandomWord(): string {
  const words = ["Meister", "Felix", "Jäger"];
  return words[Math.floor(Math.random() * words.length)];
}

export default defineWebSocketHandler({
  open(peer) {
    const { lobbyCode, user } = getUrlData(peer.request.url);

    if (!lobbies.has(lobbyCode)) {
      const lobby = createLobby();
      lobby.owner = peer.id;
      lobbies.set(lobbyCode, lobby);
    }

    const lobby = lobbies.get(lobbyCode);
    if (lobby && lobby.users) {
      user.id = peer.id;
      lobby.users[peer.id] = user;
    }
    if (!lobby) return;

    const lobbyMessage = getMessage({
      type: "update-lobby",
      lobby,
    });

    const userMessage = getMessage({
      type: "update-user",
      user,
    });

    peer.subscribe(lobbyCode);
    peer.send(lobbyMessage);
    peer.send(userMessage);
    peer.publish(lobbyCode, lobbyMessage);
    console.log("WebSocket connection opened", peer.id);
  },
  close(peer, event) {
    peer.topics.forEach((topic: string) => {
      const lobby = lobbies.get(topic);
      if (!lobby) return;

      delete lobby.users[peer.id];
      if (Object.keys(lobby.users).length === 0) {
        lobbies.delete(topic);
      }

      const message = getMessage({
        type: "update-lobby",
        lobby,
      });

      peer.publish(topic, message);
      peer.unsubscribe(topic);
    });

    console.log("Websocket closed connection", peer.id, event.reason);
  },
  error(peer, error) {
    console.log("WebSocket connection error", peer, error);
  },
  message(peer, message) {
    try {
      const data: WebSocketMessage = message.json();
      const result = getLobbyByPeerId(peer.id);
      if (!result) return;

      let { lobby, lobbyCode } = result;
      switch (data.type) {
        case "start-game":
          if (lobby?.owner !== peer.id) return;
          const impostor = getImpostor(lobby);

          if (!impostor) return;
          lobby.impostor = impostor;
          lobby.word = getRandomWord();
          lobby.state = LobbyStates.STARTING;

          setTimeout(() => {
            lobby.state = LobbyStates.RUNNING;
            const message = getMessage({ type: "update-lobby", lobby });
            peer.send(message);
            peer.publish(lobbyCode, message);
          }, 3500);
          break;
      }

      const msg = getMessage({
        type: "update-lobby",
        lobby,
      });

      peer.send(msg);
      peer.publish(lobbyCode, msg);
    } catch (e) {
      console.error("Error handling WebSocket message:", e);
    }

    console.log("WebSocket message received", peer, message);
  },
});
