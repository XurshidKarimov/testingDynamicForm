<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormField } from '~/components/ui/form';
import { toast } from 'vue-sonner';

const isOpen = ref(false);

const formsList = useStorage('forms', [], undefined, {
  serializer: { read: JSON.parse, write: JSON.stringify },
});

const formSchema = toTypedSchema(
  z.object({
    form_name: z.string().min(2).max(50),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    form_name: '',
  },
});

const onSubmit = form.handleSubmit((values) => {
  formsList.value.push({
    id: Date.now(),
    name: values.form_name,
    elements: [],
  });
  toast.success('Form created');
  isOpen.value = false;
});
</script>

<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogTrigger>
      <Button>Create form</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create form</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="form_name">
          <FormItem>
            <FormLabel>Form name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormDescription> This is form name. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button @click="onSubmit">Create</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
