<template>
  <div class="collect">
    <SortBar @typeChange="onTypeChange" @sort="onSort" />
    <FavoriteWrap v-infinite-scroll="getFavorite" :infinite-scroll-disabled="finished || loading" :infinite-scroll-distance="0">
      <template v-if="waterfall">
        <div class="card-wrap waterfall" v-masonry transition-duration="0.25s" item-selector=".favorite-card">
          <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" v-masonry-tile />
        </div>
      </template>
      <template v-else>
        <div class="card-wrap">
          <FavoriteCard v-for="favorite in favoriteList" :key="favorite.id" :data="favorite" />
        </div>
      </template>
      <p class="tip" v-show="loading">加载中...</p>
      <p class="tip" v-show="finished && !loading">没有了</p>
    </FavoriteWrap>
  </div>
  <Check />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetchScroll } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';
import FavoriteWrap from './components/FavoriteCard/FavoriteWrap.vue';
import FavoriteCard from './components/FavoriteCard/FavoriteCard.vue';
import SortBar from './container/SortBar/SortBar.vue';
import Check from './container/Check/Check.vue';

const store = useDragStore();
const route = useRoute();
const { fetchData, loading, finished, page, pageSize } = useFetchScroll();

const isVideo = computed(() => route.params.type === 'video');
const sort = computed(() => store.sort);
const type = computed(() => store.type);
const nsfw = computed(() => store.nsfw);
const waterfall = computed(() => store.waterfall);
const favoriteList = computed(() => store.favoriteList);

// 排序
const onSort = (val) => {
  store.UPDATE_SORT(val);
  reload();
};
const onTypeChange = ({ key }) => {
  store.UPDATE_TYPE(key);
  reload();
};

// 重置页码
const reload = () => {
  page.value = 1;
  store.UPDATE_FAVORITE_LIST([]);
  finished.value = false;
  getFavorite();
};

// 获取收藏
const getFavorite = async () => {
  const api = isVideo.value ? Server.VideoUseGet : Server.FavoriteGetUseGET;
  const params = {
    pageSize: pageSize.value,
    page: page.value,
    nsfw: nsfw.value,
    type: type.value,
    sort: sort.value,
    tid: isNaN(parseInt(route.params.tid)) ? '' : route.params.tid,
    is_show: route.params.type === 'recovery' ? 0 : 1
  };
  fetchData(api, params);
  if (isVideo.value) finished.value = true;
};

onMounted(() => {
  store.UPDATE_FAVORITE_LIST([]);
})

</script>

<style lang="less">
.collect {
  width: 100%;
  height: 100%;
  position: relative;
}

.tip {
  color: var(--color-gray);
  padding: 32px 0;
  text-align: center;
}

.card-wrap.waterfall {
  display: block;
  width: 100%;

  .favorite-card {
    height: auto;

    // width: auto;
    .CustomImage {
      img {
        object-fit: inherit;
        // width: auto;
        height: auto;
      }
    }

    .ToolPane {
      display: none;
    }

    .favorite-card--preview {
      border-radius: 8px;
    }
  }
}
</style>
