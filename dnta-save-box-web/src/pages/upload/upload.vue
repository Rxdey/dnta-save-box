<template>
  <div class="upload">
    <div class="upload__box" @drop="onDrop" @dragleave="onDragleave" @dragenter="onDragenter" @click="onClick">
      <div class="upload__tip">
        <template v-if="!uploadLoading">
          <el-icon :size="60">
            <v-icon icon="mdi:cloud-upload-outline" />
          </el-icon>
          <p>点击/拖拽上传图片</p>
        </template>
        <template v-else>
          <el-icon :size="60">
            <v-icon icon="line-md:uploading-loop" />
          </el-icon>
          <p>
            <span>正在上传 {{ uploadCount }} / {{ uploadList.length }}</span>
          </p>
        </template>
      </div>
    </div>
    <div class="upload__status" v-if="errorList.length"> {{ errorList.length }} 张上传失败</div>
    <div class="upload__error-list">
      <div class="image-card" v-for="(item, i) in errorList" :key="item">
        <img :src="item" draggable="false">
      </div>
    </div>
    <input type="file" ref="fileInput" multiple hidden @change="onFileChange">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';

const store = useDragStore();
const { loading, fetch } = useFetch();

const uploadLoading = ref(false);
const targetList = ref([]);
const fileInput = ref(null);
const errorList = ref([]);
const uploadList = ref([]);
const uploadCount = ref(0);

const timer = (dely = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, dely);
  });
};

const uploadImage = async (filelist) => {
  errorList.value = [];
  uploadList.value = filelist;
  uploadCount.value = 0;
  uploadLoading.value = true;
  for (let file of filelist) {
    const formData = new FormData();
    formData.append('file', file);
    uploadCount.value += 1;
    const res = await fetch(Server.FavoriteUploadImage, formData);
    if (!res) {
      errorList.value.push(window.URL.createObjectURL(file));
      continue;
    }
  }
  uploadLoading.value = false;
};
const vaildFile = (files) => {
  const fileList = Array.from(files);
  if (!fileList.length) return;
  if (fileList.every(item => !/^image/.test(item.type))) {
    ElMessage.error('请不要上传非图片文件');
    return;
  }
  uploadImage(fileList);
};
const onDrop = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', false);
  if (uploadLoading.value) return;
  vaildFile(e.dataTransfer.files);
};
const onDragleave = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', false);

};
const onDragenter = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', true);
};
const onFileChange = (e) => {
  vaildFile(e.target.files);
};
const onClick = () => {
  if (uploadLoading.value) return;
  fileInput.value.click();
};
const queryData = async () => {
  const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
  if (!res) return;
  targetList.value = res;
};
onMounted(() => {
  queryData();
});
</script>

<style lang="less" scoped>
.upload {
  padding: 32px;

  &__box {
    width: 600px;
    height: 300px;
    cursor: pointer;
    border: 5px dashed var(--color-gray1);
    color: var(--color-gray1);
    border-radius: 32px;
    text-align: center;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    position: relative;

    &[over] {
      border-color: var(--color-purple);
      color: var(--color-purple);
    }
  }

  &__tip {
    pointer-events: none;
    user-select: none;

    p {
      margin-top: 16px;
    }
  }

  &__status {
    color: var(--color-gray);
    margin-top: 30px;
    margin-bottom: 20px;
  }

  &__error-list {
    max-width: 600px;
    display: flex;
    flex-flow: row wrap;

    .image-card {
      width: 120px;
      height: 80px;
      border-radius: 16px;
      overflow: hidden;
      margin: 0 12px 12px 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
