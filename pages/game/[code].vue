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

const turnState = computed(() => {
  return userStore.user.id === game.lobby?.impostor
    ? 'You are the <span class="text-red-500">Imposter</span>'
    : `The word is: <span class="text-orange-500">${game.lobby?.word}</span>`;
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
  <div class="w-full flex flex-col items-center">
    <span v-if="!hideWord" class="text-4xl" v-html="turnState" />
    <component :is="componentMap[game.lobby?.state ?? LobbyStates.RUNNING]" />
  </div>
</template>
