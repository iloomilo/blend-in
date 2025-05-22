<template>
  <div
    class="min-h-screen background-svg bg-[radial-gradient(circle_at_50%_30%,_#FFD59E,_#ff9642,_#E17055,_#C94A4A)] rounded-xl text-white text-xl font-semibold"
  >
    <div class="container mx-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.background-svg {
  background: url("~/assets/images/bg.svg") no-repeat;
  background-size: cover;
  background-position: bottom;
}
</style>
