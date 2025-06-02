import { Lobby } from "~/types/Lobby";
import { LobbyStates } from "~/types/LobbyStates";
import { getMessage } from "~/utils/messageUtil";
import { words } from "../data/words";
import { User } from "~/types/User";
import { AvailableLanguages } from "~/types/Languages";
import { createGameCode, getRandomUsername } from "~/utils/lobbyUtil";

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

function throwErrorToPeer(peer: any, errorMessage: string|undefined = undefined): void {
  peer.send(getMessage({
    type: "return-to-home",
    errorMessage
  }));
  peer.close();
}

function getLobbyByPeerId(peerId: string, lobbies: Map<string, Lobby>): 
{ lobby: Lobby; lobbyCode: string } | null {
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

function getFormattedLobbyCode(code: string): string {
  return code.toLocaleLowerCase();
}


export const gameService = {
    getter: {
        getUrlData,
        getLobbyByPeerId,
        getNextTurnUserKey,
        getRandomUser,
        getRandomWord,
        doesUsernameExistInLobby,
        getFormattedLobbyCode,
    },
    helper: {
        createLobby,
        resetLobby,
        throwErrorToPeer,
    }
}