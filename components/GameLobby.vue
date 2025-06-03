<script setup lang="ts">
import AppGlassContainer from "./AppGlassContainer.vue";
import { useClipboard } from "@vueuse/core";

const users = computed(() => gameStore.lobby?.users);
const userStore = useUserStore();
const gameStore = useGameStore();

const isGameStartable = computed(() => {
  return Object.keys(gameStore.lobby?.users ?? {}).length >= 3;
});

const { copy } = useClipboard();
const toast = useToast();

function handleCopy() {
  const code = gameStore.lobbyCode ?? null;
  if (!code) return;

  copy(code);
  toast.add({
    title: "Copied to clipboard",
    description: `You have copied the code "${code}"" to your clipboard`,
    color: "success",
  });
}
</script>

<template>
  <AppGlassContainer class="w-fit sm:w-[500px]">
    <div v-if="users">
      <h1
        class="text-center text-2xl font-bold uppercase flex items-center justify-center"
      >
        <span class="mr-2">Lobby: {{ gameStore.lobbyCode }} </span>
        <UButton
          @click="handleCopy"
          :avatar="{
            icon: 'i-lucide-clipboard-copy',
          }"
          class="bg-transparent"
          size="xl"
          color="neutral"
          variant="ghost"
        />
      </h1>
      <hr class="my-1" />

      <ul class="p-4 space-y-4">
        <li class="px-2 py-1 bg-white/10 rounded-lg" v-for="user in users">
          {{
            userStore.user.id === user.id
              ? user.username + " (Me)"
              : user.username
          }}
        </li>

        <UButton
          type="submit"
          color="neutral"
          class="mt-2 flex justify-center items-center w-full text-center uppercase"
          size="xl"
          :loading="!isGameStartable"
          :disabled="
            gameStore.lobby?.owner !== userStore.user.id || !isGameStartable
          "
          :trailing-icon="isGameStartable ? 'i-lucide-joystick' : ''"
          @click="gameStore.startGame"
        >
          {{ isGameStartable ? "Start the game" : "Waiting for players..." }}
        </UButton>
      </ul>
    </div>
    <div v-else>Loading...</div>
  </AppGlassContainer>
</template>
