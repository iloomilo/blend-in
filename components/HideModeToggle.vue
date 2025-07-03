<script setup lang="ts">
const { hideMode } = useHideMode()
</script>

<template>
    <USwitch v-model="hideMode"></USwitch>
</template>