<template>
  <div class="template-comp">
    <button @click="count++">template_{{ count }}</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const count = ref(0);
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
