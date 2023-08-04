<template>
    <el-container direction="vertical" class="home">
        <HeaderCom />
        <el-container class="home__container">
            <AsideCom />
            <el-main class="home__main">
                <router-view :key="route.path"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HeaderCom from './container/Header/header.vue';
import AsideCom from './container/Aside/Aside.vue';

const route = useRoute();

</script>

<style lang="less">
@import url('./index.less');
</style>
