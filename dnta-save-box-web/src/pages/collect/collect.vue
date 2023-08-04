<template>
  <div class="collect">

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  console.log(route.params);
})

</script>

<style lang="less" scoped>
</style>
