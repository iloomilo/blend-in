import { Lobby } from "~/types/Lobby";
import { LobbyStates } from "~/types/LobbyStates";
import { User } from "~/types/User";
import { WebSocketMessage } from "~/types/WebSocketMessage";
import { createGameCode, getRandomUsername } from "~/utils/lobbyUtil";
import { getMessage } from "~/utils/messageUtil";
import { words } from "../data/words";
import { DecisionVote } from "~/types/Votes";
import { AvailableLanguages } from "~/types/Languages";

const lobbies = new Map<string, Lobby>();
const decisions = new Map<string, DecisionVote>();

function getUrlData(urlString: string): { lobbyCode: string; user: User } {
  const url = new URL(urlString);
  let avatar = Number(url.searchParams.get("avatar") ?? 0);
  let lobbyCode = url.searchParams.get("lobby") || createGameCode();
  let username = url.searchParams.get("username") || getRandomUsername();
  let language = url.searchParams.get("language") || "en";

  if (isNaN(avatar)) {
    avatar = 0;
  }

  const user: User = {
    username: username,
    avatar: avatar,
    language: language as AvailableLanguages
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
    language: 'en',
    createdAt: Date.now(),
  };
}

function resetLobby(lobby: Lobby): void {
  lobby.currentVote = undefined;
  lobby.currentTurnUser = undefined;
  lobby.firstTurnUser = undefined;
  lobby.impostor = undefined;
  lobby.word = undefined;
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

function getNextTurnUserKey(lobby: Lobby): string {
  const userKeys = Object.keys(lobby.users);
  const currentIndex = userKeys.findIndex(
    (key) => key === lobby.currentTurnUser
  );

  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % userKeys.length;

  return userKeys[nextIndex];
}

function getRandomUser(lobby: Lobby): string | null {
  const userIds = Object.keys(lobby.users);
  if (userIds.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * userIds.length);
  const impostorId = userIds[randomIndex];

  return lobby.users[impostorId]?.id ?? null;
}

function getRandomWord(lobby: Lobby): string {
  const lang = lobby.language ?? 'en';
  const list = words[lang]
  return list[Math.floor(Math.random() * list.length)];
}

function doesUsernameExistInLobby(lobby: Lobby, username: string): boolean {
  const usernames = Object.values(lobby.users).map(user => user.username);
  return usernames.includes(username);
}

export default defineWebSocketHandler({
  open(peer) {
    const { lobbyCode, user } = getUrlData(peer.request.url);

    if (!lobbies.has(lobbyCode)) {
      const lobby = createLobby();
      lobby.owner = peer.id;
      lobby.language = user.language ?? 'en';
      lobbies.set(lobbyCode, lobby);
    }

    const lobby = lobbies.get(lobbyCode);

    if (lobby && lobby.users) {
      if(doesUsernameExistInLobby(lobby, user.username)) {
        peer.send(getMessage({
          type: "return-to-home",
          errorMessage: `Username "${user.username}" already exists in this lobby. Please choose a different username.`
          }));
        peer.close();
        return;
    }

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

          //reset lobby, if you hit play again
          resetLobby(lobby);

          const impostor = getRandomUser(lobby);
          const currentTurnUser = getRandomUser(lobby);

          if (!impostor || !currentTurnUser) return;
          lobby.impostor = impostor;
          lobby.word = getRandomWord(lobby);
          lobby.state = LobbyStates.STARTING;
          lobby.currentTurnUser = currentTurnUser;
          lobby.firstTurnUser = currentTurnUser;

          setTimeout(() => {
            lobby.state = LobbyStates.RUNNING;
            const message = getMessage({ type: "update-lobby", lobby });
            peer.send(message);
            peer.publish(lobbyCode, message);
          }, 4000);
          break;

        case "next-turn":
          const nextTurnUser = getNextTurnUserKey(lobby);
          if (lobby.firstTurnUser === nextTurnUser) {
            lobby.state = LobbyStates.DECISION;
          }

          lobby.currentTurnUser = nextTurnUser;
          break;

        case "decide":
          const vote: DecisionVote = decisions.get(lobbyCode) ?? {
            anotherRound: 0,
            startVote: 0,
          };
          // count vote
          if (data.decision === LobbyStates.RUNNING) {
            vote.anotherRound++;
          } else {
            vote.startVote++;
          }

          // update decision
          decisions.set(lobbyCode, vote);

          const totalTurnVotes = vote.anotherRound + vote.startVote;
          const totalPlayers = Object.keys(lobby.users).length;

          // decide next state
          if (totalTurnVotes >= totalPlayers) {
            lobby.state =
              vote.startVote > vote.anotherRound
                ? LobbyStates.VOTE
                : LobbyStates.RUNNING;

            // clean up the vote
            decisions.delete(lobbyCode);
          }
          break;

        case "vote-user":
          const votedPeerId = data.peerId;
          if (!votedPeerId) return;

          if (!lobby.currentVote) {
            lobby.currentVote = {};
          }

          const oldValue = lobby.currentVote[votedPeerId] ?? 0;
          const newValue = oldValue + 1;
          lobby.currentVote[votedPeerId] = newValue;

          let totalImpostorVotes = 0;
          Object.values(lobby.currentVote).forEach((count: number) => {
            totalImpostorVotes += count;
          });

          if (totalImpostorVotes >= Object.keys(lobby.users).length) {
            lobby.state = LobbyStates.END;
          }
          break;
      }

      const msg = getMessage({
        type: "update-lobby",
        lobby,
      });

      console.log(msg);

      peer.send(msg);
      peer.publish(lobbyCode, msg);
    } catch (e) {
      console.error("Error handling WebSocket message:", e);
    } finally {
      console.log("WebSocket message received", peer.id, message);
    }
  },
});
