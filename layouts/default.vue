<template>
  <div
    class="min-h-screen test bg-[radial-gradient(circle_at_50%_30%,_#FFD59E,_#ff9642,_#E17055,_#C94A4A)] p-6 rounded-xl text-white text-xl font-semibold"
  >
    <div class="container mx-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.test {
  background: url("~/assets/images/blob-scene-haikei.svg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
