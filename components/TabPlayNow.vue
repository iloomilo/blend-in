<script setup lang="ts">
const router = useRouter();
const toast = useToast();
const state = reactive({ username: "", lobbyCode: "" });
const hasLobbyCode = computed(() => state.lobbyCode.length > 3);
const userStore = useUserStore();

function joinGame() {
  const code = state?.lobbyCode.length > 3 ? state.lobbyCode : createGameCode();
  router.push(`/game/${code}`);
}

function onSubmit() {
  toast.add({
    title: "Lobby: " + state.lobbyCode,
    description: "You entered the lobby!",
    color: "success",
  });

  userStore.setUser({
    username: state.username,
    avatar: 0,
  });

  state.username = "";
  joinGame();
}
</script>

<template>
  <div class="p-4 w-full h-full flex justify-center items-center flex-col">
    <h1 class="mb-5 text-2xl">Start a lobby to play with your friends!</h1>
    <UForm
      :state="state"
      class="w-[70%] flex flex-col justify-between h-full"
      @submit="onSubmit"
    >
      <UFormField
        label="Username"
        help="Your name will be visible for the other players."
      >
        <UInput
          v-model="state.username"
          size="lg"
          class="w-full"
          placeholder="Enter username...."
          icon="i-lucide-user"
        />
      </UFormField>

      <UFormField
        class="mt-4"
        label="Lobbycode (Optional)"
        help="Enter a lobbycode if you have one."
      >
        <UInput
          v-model="state.lobbyCode"
          size="lg"
          class="w-full"
          placeholder="Enter a lobbycode"
          icon="i-lucide-user"
        />
      </UFormField>

      <UButton
        type="submit"
        color="neutral"
        class="mt-3 flex justify-center items-center w-full text-center uppercase"
        size="xl"
        trailing-icon="i-lucide-joystick"
        loading-auto
      >
        {{ hasLobbyCode ? "JOIN" : "CREATE" }} A LOBBY
      </UButton>
    </UForm>
  </div>
</template>
