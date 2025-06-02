<script setup lang="ts">
const gameStore = useGameStore();
const hasVoted = ref(false);

function handleVote(peerId: string | null): void {
  if (hasVoted.value) return;

  if (!peerId) {
    console.error("No ID for player found!");
    return;
  }

  gameStore.socket?.send(
    getMessage({
      type: "vote-user",
      peerId,
    })
  );

  hasVoted.value = true;
}
</script>

<template>
  <div class="text-center">
    <span class="font-light">You can now vote someone</span>
    
    <div class="sm:w-xl">
      <div class="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <AppGlassContainer
          class="aspect-square h-44 mx-auto flex flex-col hover:scale-105 transition-transform cursor-pointer justify-between items-center group"
          @click="handleVote(user.id ?? null)"
          v-for="user in gameStore.lobby?.users"
        >
          <UIcon
            class="grow w-full opacity-50 group-hover:opacity-90 transition-opacity"
            size="100"
            name="cil:magnifying-glass"
          />
          <span>{{ user.username }}</span>
          <span v-if="user.id">
            Votes: {{ gameStore.lobby?.currentVote?.[user.id] ?? 0 }}
          </span>
        </AppGlassContainer>
      </div>
    </div>
  </div>
</template>

