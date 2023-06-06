<template>
  <el-container class="home">
    <HeaderCom />
    <el-container>
      <el-aside class="aside"></el-aside>
      <el-main></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';
import { customStorage } from '@/utils';
import HeaderCom from './container/Header.vue';

const router = useRouter();


onMounted(() => {
  const token = jsCookie.get('token');
  if (!token) {
    router.push('/login');
  }
})

</script>

<style lang="less">
@import url('./index.less');
</style>
