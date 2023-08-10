<template>
  <div class="convert">
    <div class="convert-toolbar">
      <!-- <upload @change="onFileUpload" /> -->
    </div>
    <div class="convert-player">
      <videoPlayer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import videoPlayer from './video.vue';

// const videoData = ref(null);
// const onFileUpload = (data) => {
//   videoData.value = data;
// };
</script>

<style lang="less">
@import url('./index.less');
</style>
