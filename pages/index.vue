<template>
  <main class="h-screen flex justify-center items-center pb-40 flex-col">
    <NuxtImg
      src="/images/logo.png"
      alt="Blendin Logo"
      width="300"
      height="300"
      placeholder
      format="webp"
      class="drop-shadow-2xl rounded-full"
    />
    <AppGlassContainer class="w-xl max-h-[600px] overflow-y-auto">
      <HomeTabs />
    </AppGlassContainer>
  </main>
</template>
