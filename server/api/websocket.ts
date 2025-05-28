import { Lobby } from "~/types/Lobby";
import { LobbyStates } from "~/types/LobbyStates";
import { WebSocketMessage } from "~/types/WebSocketMessage";
import { getMessage } from "~/utils/messageUtil";
import { DecisionVote } from "~/types/Votes";
import { gameService } from "../services/gameService";

const lobbies = new Map<string, Lobby>();
const decisions = new Map<string, DecisionVote>();

export default defineWebSocketHandler({
  open(peer) {
    const { lobbyCode, user } = gameService.getter.getUrlData(peer.request.url);

    if (!lobbies.has(lobbyCode)) {
      const lobby = gameService.helper.createLobby();
      lobby.owner = peer.id;
      lobby.language = user.language ?? 'en';
      lobbies.set(lobbyCode, lobby);
    }

    const lobby = lobbies.get(lobbyCode);
    if (!lobby || !lobby.users) {
      gameService.helper.throwErrorToPeer(peer, `Lobby with code "${lobbyCode}" does not exist.`);
      return;
    }

    //prevent players from joining if the username is taken
    if(gameService.getter.doesUsernameExistInLobby(lobby, user.username)) {
      gameService.helper.throwErrorToPeer(peer, `Username "${user.username}" already exists in this lobby. Please choose a different username.`);
      return;
    }
    
    // prevent players from joining if the game is running
    if(lobby?.state !== LobbyStates.PRE_LOBBY && lobby?.state !== LobbyStates.END) {
      gameService.helper.throwErrorToPeer(peer, `Game is already running in this lobby. Wait until the round ends!`);
      return;
    }

    // everything worked fine
    user.id = peer.id;
    lobby.users[peer.id] = user;

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
    console.log(`WebSocket opened connection! ${user.username} (${peer.id}) joined lobby ${lobbyCode}`);

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
    console.log(`WebSocket closed connection! Lobby: ${Array.from(peer.topics).join(", ")}, Peer ID: ${peer.id}, Event: ${event.reason} (${event.code})`,);
  },
  error(peer, error) {
    console.log(`WebSocket error occurred! Peer ID: ${peer.id}, Error: ${error.message}, Lobby: ${Array.from(peer.topics).join(", ")}`);
  },
  message(peer, message) {
    try {
      const data: WebSocketMessage = message.json();
      const result = gameService.getter.getLobbyByPeerId(peer.id, lobbies);
      if (!result) return;

      let { lobby, lobbyCode } = result;
      switch (data.type) {
        case "start-game":
          if (lobby?.owner !== peer.id) return;

          //reset lobby, if you hit play again
          gameService.helper.resetLobby(lobby);

          const impostor = gameService.getter.getRandomUser(lobby);
          const currentTurnUser = gameService.getter.getRandomUser(lobby);

          if (!impostor || !currentTurnUser) return;
          lobby.impostor = impostor;
          lobby.word = gameService.getter.getRandomWord(lobby);
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
          const nextTurnUser = gameService.getter.getNextTurnUserKey(lobby);
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

      peer.send(msg);
      peer.publish(lobbyCode, msg);
    } catch (e) {
      console.error("Error processing WebSocket message:", e);
      console.error("Message content:", message);
      console.error("User", peer.id);
    } finally {
      console.log("WebSocket message received", peer.id, message);
    }
  },
});
