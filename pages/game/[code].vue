<script setup lang="ts">
import { LobbyStates } from "~/types/LobbyStates";

const game = useGameStore();
const route = useRoute();
const code = (route.params.code ?? "") as string;
const userStore = useUserStore();

onMounted(() => {
  if (!code || !userStore.user) return;
  game.connectToLobby(code, userStore.user);
});
</script>
<template>
  <GameLobby v-if="game.lobby?.state === LobbyStates.PRE_LOBBY" />
  <GameCounter v-if="game.lobby?.state === LobbyStates.STARTING" />
  <GameRunning v-if="game.lobby?.state === LobbyStates.RUNNING" />
</template>
