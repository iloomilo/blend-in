<script setup lang="ts">
import type { Lobby } from "~/types/Lobby";
import type { User } from "~/types/User";

const gameStore = useGameStore();
const userStore = useUserStore();

function getHighestVoted(lobby: Lobby | null): string {
  const vote = lobby?.currentVote ?? {};

  let highestUser = "";
  let highestVotes = -1;

  for (const [key, value] of Object.entries(vote)) {
    if (value > highestVotes) {
      highestVotes = value;
      highestUser = key;
    }
  }

  return highestUser;
}

function getImposter(): User | null {
  const imposterPeerId = gameStore.lobby?.impostor;
  if (!imposterPeerId) return null;

  return gameStore.lobby?.users[imposterPeerId] ?? null;;
}

function handlePlayAgain(): void {
  gameStore.socket?.send(
    getMessage({
      type: "start-game",
    })
  );
}
</script>
<template>
  <div class="text-center text-4xl">
    <p>
      The imposter was:
      <span class="text-red-500">{{ getImposter()?.username }}</span>
    </p>
    <UButton
      v-if="gameStore.lobby?.owner === userStore.user.id"
      @click="handlePlayAgain"
      color="neutral"
      class="mt-4"
      >Play Again</UButton
    >
  </div>
</template>
