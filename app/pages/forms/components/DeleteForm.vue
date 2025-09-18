<script setup lang="ts">
type EmitType = (event: 'delete') => void;

const emit = defineEmits<EmitType>();
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>Delete</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete form</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <p>You are sure?</p>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose>
          <Button @click="emit('delete')" variant="destructive">Remove</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
