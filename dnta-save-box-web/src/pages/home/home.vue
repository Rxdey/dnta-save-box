<template>
    <el-container direction="vertical" class="home">
        <HeaderCom />
        <el-container class="home__container" v-if="loginStatus">
            <AsideCom />
            <el-main class="home__main">
                <router-view :key="route.path" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';
import HeaderCom from './container/Header/header.vue';
import AsideCom from './container/Aside/aside.vue';

const route = useRoute();
const router = useRouter();
const loginStatus = ref(false);

onMounted(async () => {
    // window.addEventListener('resize', _.throttle(() => {
    //     if (!hideMenu.value && window.innerWidth < 1200) {
    //         hideMenu.value = true;
    //     }
    //     if (window.innerWidth > 1200) {
    //         hideMenu.value = false;
    //     }
    // }, 200),);
    const token = jsCookie.get('token');
    loginStatus.value = !!token;
    if (!loginStatus.value) {
        ElNotification({
            title: '请先登录',
            message: '',
            type: 'warning',
        });
        router.push('/login');
        return;
    }
});
</script>

<style lang="less">
@import url('./index.less');
</style>
