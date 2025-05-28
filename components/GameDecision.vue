<script setup lang="ts">
import { LobbyStates } from "~/types/LobbyStates";
const gameStore = useGameStore();
const hasVoted = ref(false);

function handleDecision(decision: LobbyStates) {
  gameStore.socket?.send(
    getMessage({
      type: "decide",
      decision,
    })
  );

  hasVoted.value = true;
}
</script>

<template>
  <div
    class="flex justify-center gap-2 mt-4"
    v-if="gameStore.lobby?.state === LobbyStates.DECISION && !hasVoted"
  >
    <UButton
      color="neutral"
      class="w-fit"
      size="lg"
      icon="lucide:repeat"
      @click="handleDecision(LobbyStates.RUNNING)"
      >Another Round</UButton
    >
    <UButton
      color="neutral"
      class="w-fit"
      size="lg"
      icon="lucide:vote"
      @click="handleDecision(LobbyStates.VOTE)"
      >Vote</UButton
    >
  </div>
</template>
