<template>
  <div
    class="relative min-h-screen overflow-hidden rounded-xl text-white text-xl font-semibold"
  >
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
  width: 100%;
  height: 100%;
  background: url("~/assets/images/bg-new.svg") repeat-x;
  background-size: auto 100%;
  animation: scroll-bg 35s linear infinite;
  pointer-events: none;
}

@keyframes scroll-bg {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -2000px 0;
  }
}
</style>
