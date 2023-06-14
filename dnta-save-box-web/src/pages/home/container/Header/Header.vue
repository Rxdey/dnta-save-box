<template>
    <el-header class="header">
        <div class="header-left">
            <img src="/logo.png" alt="logo" />
            DNTA BOX
        </div>
        <div class="header-center"></div>
        <div class="header-right">
            <div class="user" @click="toggleNsfw">
                <img :nsfw="!!nsfw" v-lazy :src="userInfo.avatar" class="avatar" :title="userInfo.nick_name">
            </div>
        </div>
    </el-header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { customStorage } from '@/utils';
import useDragStore from '@/store/modules/useDragStore';

const store = useDragStore();
const nsfw = computed(() => store.nsfw);
const userInfo = computed(() => customStorage.getItem('userInfo') || {});

const toggleNsfw = () => {
    store.UPDATE_NSFW(nsfw.value ? 0 : 1);
    setTimeout(() => {
        window.location.reload();
    }, 0);
};

</script>

<style lang="less">
@import url('./index.less');
</style>
