<script setup lang="ts">
const userStore = useUserStore();
const gameStore = useGameStore();
</script>

<template>
  <ul>
    <li v-for="user in gameStore.lobby?.users" :key="user.id">
      {{ user.username }}
    </li>
  </ul>
</template>
