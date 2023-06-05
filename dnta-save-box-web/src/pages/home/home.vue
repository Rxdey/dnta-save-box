<template>
  <div class="home">
    首页
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';

const router = useRouter();

onMounted(() => {
  const token = jsCookie.get('token');
  if (!token) {
    router.push('/login');
  }
})

</script>

<style lang="less">
</style>
