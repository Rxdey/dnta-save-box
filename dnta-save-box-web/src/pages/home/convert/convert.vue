<template>
  <div class="convert">
    <div class="convert-player">
      <videoPlayer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import videoPlayer from './video.vue';
import useMainStore from '@/store/modules/useMainStore';

const store = useMainStore();
// const videoData = ref(null);
// const onFileUpload = (data) => {
//   videoData.value = data;
// };
onMounted(() => {
  store.UPDATE_HIDE_MENU(true);
});
</script>

<style lang="less">
@import url('./index.less');
</style>
