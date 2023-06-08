<template>
    <el-header class="header">
        <div class="header-left">
            <img src="/logo.png" alt="logo" />
            DNTA BOX
        </div>
        <div class="header-center"></div>
        <div class="header-right">
            <div class="user">
                <img :src="userInfo.avatar" class="avatar" :title="userInfo.nick_name">
            </div>
        </div>
    </el-header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { customStorage } from '@/utils';

const userInfo = computed(() => customStorage.getItem('userInfo') || {});


</script>

<style lang="less">
@import url('./index.less');
</style>
