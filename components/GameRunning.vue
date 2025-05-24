<script setup lang="ts">
import { LobbyStates } from "~/types/LobbyStates";

const gameStore = useGameStore();
const userStore = useUserStore();
const hasVoted = ref(false);

const text = computed(() => {
  return userStore.user.id === gameStore.lobby?.impostor
    ? "You are the Imposter"
    : `The word is: ${gameStore.lobby?.word}`;
});

const showIsMyTurn = computed(
  () =>
    gameStore.lobby?.currentTurnUser === userStore.user.id &&
    gameStore.lobby?.state === LobbyStates.RUNNING
);

function handleContinue() {
  gameStore.socket?.send(
    getMessage({
      type: "next-turn",
    })
  );

  hasVoted.value = false;
}

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
  <main class="flex justify-center h-screen items-center flex-col gap-2">
    <span class="text-5xl">{{ text }}</span>

    <div v-if="showIsMyTurn" class="flex flex-col gap-2 items-center">
      <span>It's your turn!</span>
      <UButton color="neutral" class="w-fit" @click="handleContinue"
        >Continue</UButton
      >
    </div>

    <div
      class="flex gap-2"
      v-if="gameStore.lobby?.state === LobbyStates.DECISION && !hasVoted"
    >
      <UButton
        color="neutral"
        class="w-fit"
        @click="handleDecision(LobbyStates.RUNNING)"
        >Another Round</UButton
      >
      <UButton
        color="neutral"
        class="w-fit"
        @click="handleDecision(LobbyStates.VOTE)"
        >Vote</UButton
      >
    </div>
  </main>
</template>
