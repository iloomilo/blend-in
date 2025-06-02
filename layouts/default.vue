<template>
  <div class="relative min-h-screen overflow-hidden rounded-xl text-white text-xl font-semibold">
    <AppInfos class="absolute top-5 z-20" />

    <main class="grid h-screen sm:h-[90vh] place-content-center z-10 relative">
      <NuxtLink to="/">
        <NuxtImg
          src="/images/logo.png"
          alt="Blendin Logo"
          sizes="150px sm:250px"
          placeholder
          format="webp"
          class="drop-shadow-2xl w-[150px] sm:w-[250px] rounded-full mx-auto"
        />
      </NuxtLink>
      <slot />
    </main>
    <div class="background" />
  </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 4000px;
  height: 100%;
  background: url("~/assets/images/bg-new.svg") no-repeat;
  background-size: cover;
  animation: scroll-bg 35s linear infinite alternate;
  pointer-events: none;
}

@keyframes scroll-bg {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-2000px); /* je nach Layout: Hälfte der Bildbreite oder ganzer Durchlauf */
  }
}
</style>
