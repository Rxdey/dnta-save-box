<template>
  <div class="convert">
    <div class="video">
      <div class="video__content">
        <div class="video__upload" @drop="onDrop" @dragleave="onDragleave" @dragenter="onDragenter" @click="onClick"> click/drag to upload </div>
      </div>
      <div class="video__timeline">
        <TimeLine :options="timeOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDrag } from '../upload/useDrag';
import TimeLine from './components/Timeline/timeline.vue';


const timeOptions = {
  totalTime: 10000,

};

const vaildFile = (files) => {
  const fileList = Array.from(files);
  if (!fileList.length) return;
  if (fileList.every(item => !/^video/.test(item.type))) {
    ElMessage.error('请不要上传非视频文件');
    return;
  }
  console.log(files[0]);
};
const { uploadLoading, onDrop, onDragleave, onDragenter, onFileChange } = useDrag(vaildFile);

</script>

<style lang="less" scoped>
.convert {
  padding: 32px;
}

.video {
  width: 100%;
  background-color: #121316;
  color: #989898;


  &__content {
    height: 600px;
    // border-bottom: 1px solid #6c707e;
    position: relative;
  }

  &__timeline {
    height: 80px;
    position: relative;
  }

  &__upload {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
