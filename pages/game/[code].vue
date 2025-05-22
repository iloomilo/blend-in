<script setup lang="ts">
const route = useRoute();

const code = route.params.code;
</script>
<template>
  <p>Du bist im Game! {{ code }}</p>
</template>