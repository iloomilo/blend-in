<script setup lang="ts">
import GameCounter from "~/components/GameCounter.vue";
import GameDecision from "~/components/GameDecision.vue";
import GameEnd from "~/components/GameEnd.vue";
import GameLobby from "~/components/GameLobby.vue";
import GameTurn from "~/components/GameTurn.vue";
import GameVotePlayer from "~/components/GameVotePlayer.vue";
import { LobbyStates } from "~/types/LobbyStates";

const game = useGameStore();
const route = useRoute();
const code = (route.params.code ?? "") as string;
const userStore = useUserStore();

const text = computed(() => {
  return userStore.user.id === game.lobby?.impostor
    ? "You are the Imposter"
    : `The word is: ${game.lobby?.word}`;
});

const hideWordStates = [
  LobbyStates.STARTING,
  LobbyStates.PRE_LOBBY,
  LobbyStates.END,
];

const hideWord = computed(() => {
  const state = game.lobby?.state;
  return state !== undefined && hideWordStates.includes(state);
});

const componentMap = {
  [LobbyStates.VOTE]: GameVotePlayer,
  [LobbyStates.DECISION]: GameDecision,
  [LobbyStates.RUNNING]: GameTurn,
  [LobbyStates.PRE_LOBBY]: GameLobby,
  [LobbyStates.STARTING]: GameCounter,
  [LobbyStates.END]: GameEnd,
};

onMounted(() => {
  if (!code || !userStore.user) return;
  game.connectToLobby(code, userStore.user);
});
</script>
<template>
  <main class="flex justify-center items-center h-screen flex-col">
    <span v-if="!hideWord" class="text-5xl">{{ text }}</span>
    <component :is="componentMap[game.lobby?.state ?? LobbyStates.RUNNING]" />
  </main>
</template>
