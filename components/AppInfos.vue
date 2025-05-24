<template>
  <nav class="flex font-light w-full justify-between mx-auto gap-4 px-8">
    <NuxtLink
      to="/imprint"
      class="hover:opacity-100 flex items-center opacity-70 cursor-pointer transition-opacity"
    >
      Imprint
    </NuxtLink>
    <div class="flex items-center gap-4">
      <UTooltip :delay-duration="0" text="🔓 This project is 100% open source!">
        <NuxtLink
          to="https://github.com/iloomilo/blend-in"
          target="_blank"
          class="hover:opacity-100 flex items-center opacity-70 cursor-pointer transition-opacity"
        >
          <NuxtImg
            src="/images/github-logo.svg"
            alt="GitHub Logo"
            width="30"
            height="30"
            placeholder
            format="webp"
            class="rounded-full mx-auto"
          />
        </NuxtLink>
      </UTooltip>
      <UTooltip :delay-duration="0" text="❤️ Support me on Kofi!">
        <NuxtLink
          to="https://ko-fi.com/iloomilo"
          target="_blank"
          class="hover:opacity-100 flex items-center opacity-70 cursor-pointer transition-opacity"
        >
          <NuxtImg
            src="/images/kofi-logo.png"
            alt="Kofi Logo"
            placeholder
            width="112"
            height="30"
            format="webp"
            class="x-auto w-28"
          />
        </NuxtLink>
      </UTooltip>
    </div>
  </nav>
</template>
