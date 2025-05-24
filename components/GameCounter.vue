<script setup lang="ts">
const counter = ref<number>(0);
onMounted(() => {
  counter.value = 3;

  let interval = setInterval(() => {
    if (counter.value <= 0) {
      clearInterval(interval);
    }

    counter.value--;
  }, 1000);
});
</script>
<template>
  <main class="flex justify-center items-center">
    <h1 class="text-5xl">{{ counter }}</h1>
  </main>
</template>
