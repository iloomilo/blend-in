<template>
  <div
    class="relative min-h-screen background-svg rounded-xl text-white text-xl font-semibold"
  >
    <AppInfos class="absolute top-5" />
    <main class="grid h-screen sm:h-[90vh] place-content-center">
      <NuxtLink to="/">
        <NuxtImg
          src="/images/logo.png"
          alt="Blendin Logo"
          sizes="100px sm:250px"
          placeholder
          format="webp"
          class="drop-shadow-2xl w-[100px] sm:w-[250px]  rounded-full mx-auto"
        />
      </NuxtLink>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.background-svg {
  background: url("~/assets/images/bg.svg") no-repeat;
  background-size: cover;
  background-position: bottom;
}
</style>
