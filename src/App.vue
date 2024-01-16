<template>
  <!-- <button @click="count += 1">{{ count }}</button> -->
  <!-- <img :src="image1" />
  <img :src="image2" />
  <img :src="small" />
  <img :src="mid" />
  <img :src="mid" /> -->
  <template-comp />
  <tsx-comp />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import TsxComp from '@/components/TsxComp/TsxComp';
import TemplateComp from '@/components/TemplateComp/TemplateComp.vue';
const count = ref();
console.log(dayjs().format('yyyy-mm-dd'));

console.log(process.env.mode, process.env.name, '');
console.log(121231);
const p = Promise.resolve('p');
const arr: string[] = [];
arr.includes('1');
console.log(arr ?? '1111');
console.log(arr ?? '111');
</script>
<style lang="scss"></style>
