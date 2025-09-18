<template>
  <div class="py-4">
    <CreateForm />
    <Table v-if="sortedForms.length">
      <TableCaption>A list of forms.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">FormID</TableHead>
          <TableHead>Form name (link)</TableHead>
          <TableHead class="text-right"> Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="form in sortedForms" :key="form.id">
          <TableCell class="font-medium">
            {{ form.id }}
          </TableCell>
          <TableCell>
            <NuxtLink :to="`/forms/${form.id}`"> {{ form.name }}</NuxtLink>
          </TableCell>
          <TableCell class="text-right">
            <DeleteForm @delete="deleteForm(form.id)" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-else>No forms available</div>
  </div>
</template>

<script setup lang="ts">
import type { FormType } from '../type';
import CreateForm from './components/CreateForm.vue';
import DeleteForm from './components/DeleteForm.vue';
import { useStorage } from '@vueuse/core';
import { toast } from 'vue-sonner';

const formsList = useStorage<FormType[]>('forms', [] as FormType[], undefined, {
  serializer: {
    read: (v: string) => JSON.parse(v) as FormType[],
    write: (v: FormType[]) => JSON.stringify(v),
  },
});

const sortedForms = computed(() => {
  return [...formsList.value].sort((a, b) => b.id - a.id);
});

const deleteForm = (id: number) => {
  formsList.value = formsList.value.filter((form) => form.id !== id);
  toast.success('Form removed');
};
</script>

<style scoped></style>
