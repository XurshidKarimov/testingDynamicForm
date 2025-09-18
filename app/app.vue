<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <NuxtLayout>
    <Toaster richColors position="top-right" />
    <NuxtPage />
  </NuxtLayout>
</template>
