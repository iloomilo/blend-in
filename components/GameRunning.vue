<script setup lang="ts">
const gameStore = useGameStore();
const userStore = useUserStore();

const text = computed(() => {
  return userStore.user.id === gameStore.lobby?.impostor
    ? "You are the Impostor"
    : `The word is: ${gameStore.lobby?.word}`;
});
</script>

<template>
  <main class="flex justify-center h-screen items-center">
    <span class="text-5xl">{{ text }}</span>
  </main>
</template>
