<script setup lang="ts">
const gameStore = useGameStore();
const userStore = useUserStore();

function handleContinue() {
  gameStore.socket?.send(
    getMessage({
      type: "next-turn",
    })
  );
}
</script>

<template>
  <div
    v-if="gameStore.lobby?.currentTurnUser === userStore.user.id"
    class="flex flex-col gap-2 items-center"
  >
    <span>It's your turn!</span>
    <UButton color="neutral" class="w-fit" @click="handleContinue"
      >Continue</UButton
    >
  </div>
</template>
