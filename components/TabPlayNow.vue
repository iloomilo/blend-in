<script setup lang="ts">
const state = reactive({ username: "" });

async function validate(): Promise {}

function onSubmit() {}
</script>

<template>
  <div class="p-4 w-full h-full flex justify-center items-center flex-col">
    <h1 class="mb-5">Create a lobby!</h1>
    <UForm
      :state="state"
      class="w-[70%] grid content-center"
      :validate="validate"
      @submit="onSubmit"
    >
      <UFormField name="username">
        <UInput
          v-model="state.username"
          placeholder=""
          size="xl"
          class="w-full"
          :ui="{ base: 'peer' }"
        >
          <label
            class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
          >
            <span class="inline-flex bg-default px-1">Username</span>
          </label>
        </UInput>
      </UFormField>
      <UButton
        type="submit"
        color="neutral"
        class="mt-2 flex justify-center items-center w-full text-center"
        size="xl"
        trailing-icon="i-lucide-arrow-right"
        loading-auto
      >
        Create a lobby
      </UButton>
    </UForm>
  </div>
</template>
