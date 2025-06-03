<script setup lang="ts">
const gameStore = useGameStore();
const userStore = useUserStore();

const currentTurnUserName = computed(() => {
  const currentTurnUser = gameStore.lobby?.currentTurnUser;
  if (!currentTurnUser) return "Unkown";

  return gameStore.lobby?.users[currentTurnUser]?.username ?? "Unknown";
});

function handleContinue() {
  gameStore.socket?.send(
    getMessage({
      type: "next-turn",
    })
  );
}
</script>

<template>
  <div>
    <div
      v-if="gameStore.lobby?.currentTurnUser === userStore.user.id"
      class="flex flex-col gap-2 items-center"
    >
      <span>It's your turn!</span>
      <UButton
        color="neutral"
        size="lg"
        icon="lucide:arrow-right-to-line"
        class="w-fit"
        @click="handleContinue"
        >Continue
      </UButton>
    </div>
    <span v-else class="text-2xl">Current Turn: {{ currentTurnUserName }}</span>
  </div>
</template>
