<script setup lang="ts">
import type { ElementType } from '~/pages/type';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormField } from '~/components/ui/form';
import { toast } from 'vue-sonner';
import TextInputSettings from './TextInputSettings.vue';
import RadioButtonSettings from './RadioButtonSettings.vue';
import SelectSettings from './SelectSettings.vue';
import CheckboxSettings from './CheckboxSettings.vue';

type EmitType = {
  (_e: 'element-saved', _element: ElementType): void;
};

type PropsType = {
  element?: ElementType;
};

const { element } = defineProps<PropsType>();

const emit = defineEmits<EmitType>();

const isOpen = ref(false);

const textSettings = ref({
  placeholder: '',
  defaultValue: '',
});

const radioElements = ref([]);
const radioDefaultValue = ref('');

const checkboxElements = ref([]);

const selectSettings = ref({
  isRelated: false,
  isRelatedSelectRequired: false,
  isRelatedWith: null,
  isMultiple: false,
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    order: z.number().min(0),
    label: z.string().min(2).max(50),
    type: z.enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'date']),
    required: z.boolean(),
    width: z.number().min(1).max(12),
  }),
);

const initialValues = {
  name: element?.name || '',
  order: element?.order || 0,
  label: element?.label || '',
  type: element?.type || 'text',
  required: element?.required || false,
  width: element?.width || 12,
} as const;

const form = useForm({
  validationSchema: formSchema,
  initialValues,
});

const generateOptions = (type: string) => {
  switch (type) {
    case 'text':
    case 'textarea':
      return textSettings.value;
    case 'radio':
      return {
        items: radioElements.value,
        defaultValue: radioDefaultValue.value,
      };
    case 'select':
      return selectSettings.value;
    case 'checkbox':
      return {
        items: checkboxElements.value,
      };
    default:
      return {};
  }
};

const onSave = form.handleSubmit((values) => {
  if (values.type === 'radio' && !radioElements.value.length) {
    toast.error('Please add at least one radio option');
    return;
  }
  if (values.type === 'checkbox' && !checkboxElements.value.length) {
    toast.error('Please add at least one checkbox option');
    return;
  }

  emit('element-saved', {
    id: element?.id || Date.now(),
    name: values.name,
    order: values.order,
    label: values.label,
    type: values.type,
    required: values.required,
    width: values.width,
    options: generateOptions(values.type),
  });

  toast.success('Element saved');
  isOpen.value = false;
});

watch(isOpen, (open) => {
  if (open) {
    form.resetForm({ values: initialValues });

    if (element) {
      if (form.values.type === 'text' || form.values.type === 'textarea') {
        textSettings.value = {
          placeholder: element.options?.placeholder || '',
          defaultValue: element.options?.defaultValue || '',
        };
      } else {
        textSettings.value = { placeholder: '', defaultValue: '' };
      }
      radioElements.value = element.options?.items || [];
      radioDefaultValue.value = element.options?.defaultValue || '';
      selectSettings.value = {
        isRelated: element.options?.isRelated || false,
        isRelatedSelectRequired:
          element.options?.isRelatedSelectRequired || false,
        isRelatedWith: element.options?.isRelatedWith || null,
        isMultiple: element.options?.isMultiple || false,
      };
      checkboxElements.value = element.options?.items || [];
    } else {
      textSettings.value = { placeholder: '', defaultValue: '' };
      radioElements.value = [];
      radioDefaultValue.value = '';
      selectSettings.value = {
        isRelated: false,
        isRelatedSelectRequired: false,
        isRelatedWith: null,
        isMultiple: false,
      };
      checkboxElements.value = [];
    }
  }
});
</script>

<template>
  <Dialog modal :open="isOpen" @update:open="isOpen = $event">
    <DialogTrigger>
      <Button v-if="!element">Add element</Button>
      <Button v-else type="button">Edit</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Element settings</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSave">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Element name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="order">
          <FormItem>
            <FormLabel>Element order</FormLabel>
            <FormControl>
              <Input type="number" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="width">
          <FormItem>
            <FormLabel>Element width</FormLabel>
            <FormControl>
              <Input type="number" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="label">
          <FormItem>
            <FormLabel>Element label</FormLabel>
            <FormControl>
              <Input type="text" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="type">
          <FormItem>
            <FormLabel>Element type</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Datepicker</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ value, handleChange }" name="required">
          <FormItem class="flex flex-row items-center space-x-2">
            <FormControl>
              <Checkbox
                :model-value="value"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormLabel class="text-base">Is required</FormLabel>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
      <TextInputSettings
        v-if="form.values.type === 'text' || form.values.type === 'textarea'"
        v-model:default-value="textSettings.defaultValue"
        v-model:placeholder="textSettings.placeholder"
      />
      <RadioButtonSettings
        v-else-if="form.values.type === 'radio'"
        v-model:default-value="radioDefaultValue"
        v-model:items="radioElements"
      />
      <SelectSettings
        v-else-if="form.values.type === 'select'"
        v-model:is-related="selectSettings.isRelated"
        v-model:is-related-select-required="
          selectSettings.isRelatedSelectRequired
        "
        v-model:is-related-with="selectSettings.isRelatedWith"
        v-model:is-multiple="selectSettings.isMultiple"
      />
      <CheckboxSettings
        v-else-if="form.values.type === 'checkbox'"
        v-model:items="checkboxElements"
      />
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button @click="onSave">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
