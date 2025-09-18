<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow">
      <div class="mx-auto container py-5">
        <NuxtLink class="text-3xl font-bold text-gray-900" to="/"
          >My Application</NuxtLink
        >
      </div>
    </header>
    <main class="grow mx-auto container">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
