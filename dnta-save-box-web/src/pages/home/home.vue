<template>
  <el-container direction="vertical" class="home">
    <HeaderWap />
    <el-container style="min-height: 1px;">
      <AsideMenu :tagList="tagList" @change="onChange" />
      <el-main class="main" v-infinite-scroll="getFavorite" :infinite-scroll-disabled="finished || loading" :infinite-scroll-distance="20">
        <FavoriteWrap v-if="favoriteList.length">
          <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" />
        </FavoriteWrap>
        <p class="tip" v-show="loading">loading...</p>
        <p class="tip" v-show="finished">没有更多了</p>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import jsCookie from 'js-cookie';

import HeaderWap from './container/Header.vue';
import AsideMenu from './container/AsideMenu.vue';
import FavoriteWrap from './components/FavoriteCard/FavoriteWrap.vue';
import FavoriteCard from './components/FavoriteCard/FavoriteCard.vue';
import * as Server from '@/service/model/api';
import { BASE_URL } from '@/service/api.config';
import useDragStore from '@/store/modules/useDragStore';

const store = useDragStore();
const router = useRouter();
const tagList = ref([]);
const page = ref(1);
const pageSize = ref(30);
const loading = ref(false);
const finished = ref(false);

const favoriteList = computed(() => store.favoriteList);
const tid = ref(null);

const getTag = async () => {
  const res = await Server.TagAllUseGET();
  const { data, success, msg } = res;
  if (!success) {
    ElMessage.error(msg);
    return;
  }
  tagList.value = data;
};

const getFavorite = async () => {
  if (finished.value) return;
  const params = {
    tid: tid.value,
    pageSize: pageSize.value,
    page: page.value
  };
  loading.value = true;
  const res = await Server.FavoriteGetUseGET(params);
  loading.value = false;
  const { data, success, msg } = res;
  if (!success) {
    ElMessage.error(msg);
    return;
  }
  finished.value = data.list.length < pageSize.value;
  const list = favoriteList.value.concat(...data.list.map(item => {
    return {
      ...item,
      path: item.path ? item.path.replace('./download', BASE_URL) : ''
    };
  }));
  store.UPDATE_FAVORITE_LIST(list);
  page.value += 1;
};


const onChange = (index, tag) => {
  page.value = 1;
  tid.value = tag?.id || null;
  store.UPDATE_FAVORITE_LIST([]);
  finished.value = false;
};

onMounted(async () => {
  const token = jsCookie.get('token');
  if (!token) {
    router.push('/login');
    return;
  }
  await getTag();
})

</script>

<style lang="less">
@import url('./index.less');
</style>
