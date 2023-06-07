<template>
  <div class="favorite-wrap">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
