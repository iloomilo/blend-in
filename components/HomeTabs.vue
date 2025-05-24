<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const userStore = useUserStore();
const gameStore = useGameStore();

const items = ref<TabsItem[]>([
  {
    label: "Play Now",
    icon: "i-lucide-play",
  },
  {
    label: "How To Play",
    icon: "i-lucide-circle-help",
  },
]);

onMounted(() => {
  userStore.resetUser();
  gameStore;
});
</script>

<template>
  <UTabs
    :unmount-on-hide="false"
    :items="items"
    color="neutral"
    size="xl"
    :ui="{
      list: 'bg-white/20 text-white rounded-md',
      trigger: 'hover:bg-white/30 text-white',
      indicator: 'bg-white',
    }"
  >
    <template #content="{ item, index }">
      <div v-if="index === 0">
        <TabPlayNow />
      </div>
      <div v-else-if="index === 1">
        <TabGettingStarted />
      </div>
    </template>
  </UTabs>
</template>
