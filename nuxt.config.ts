// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/image", "@nuxt/icon", "@nuxt/ui", "@pinia/nuxt"],
  image: {
    format: ["webp"],
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
