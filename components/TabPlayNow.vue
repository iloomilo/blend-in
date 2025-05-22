<script setup lang="ts">
import type {FormErrorEvent} from "#ui/types";

import {useWebSocket} from "@vueuse/core";

const host = window?.location.host || 'localhost:3000'; // todo change this
const router = useRouter();

const { status, data, send, open, close } = useWebSocket(`ws://${host}/api/websocket`);
const toast = useToast();
const state = reactive({ username: "" });

async function validate() {
  const errors = [];
  if(!state.username || state.username.length < 3) {
    errors.push({name: "Invalid Username", message: "Username must be 3 characters long!"});
  }
  return errors;
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.length) {
    toast.add({
      title: event.errors[0].name,
      description: event.errors[0].message,
      color: 'error'
    });
  }
}

function createGameCode() {
  return Math.random().toString(36).substring(2, 8);
}
function createGame() {
  router.push(`/game/${createGameCode()}`);
}

function onSubmit() {
  toast.add({
    title: 'Form Success',
    description: 'You entered the lobby!',
    color: 'success'
  });

  send(state.username)
  state.username = "";
  createGame()
}
</script>

<template>
  <div class="p-4 w-full h-full flex justify-center items-center flex-col">
    <h1 class="mb-5">Start a lobby to play with your friends!</h1>
    <UForm
      :state="state"
      class="w-[70%] flex flex-col justify-between h-full"
      :validate="validate"
      @error="onError"
      @submit="onSubmit"
    >
      <UFormField label="Username" help="Your name will be visible for the other players." required>
        <UInput v-model="state.username"  class="w-full" placeholder="Enter username...." icon="i-lucide-user" />
      </UFormField>
      <UButton
        type="submit"
        color="neutral"
        class="mt-2 flex justify-center items-center w-full text-center"
        size="xl"
        trailing-icon="i-lucide-joystick"
        loading-auto
      >
        CREATE A LOBBY
      </UButton>
      <pre>
        data:
        {{data}}
      </pre>
    </UForm>
  </div>
</template>
