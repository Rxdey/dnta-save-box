<template>
  <div class="upload">
    <div class="upload__box" @drop="onDrop" @dragleave="onDragleave" @dragenter="onDragenter">
      <div class="upload__tip">
        <el-icon :size="60">
          <v-icon icon="mdi:cloud-upload-outline" />
        </el-icon>
        <p>点击/拖拽上传图片</p>
      </div>
    </div>
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

const targetList = ref([]);
const uploadList = ref([]);

const onDrop = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', false);
  const fileList = Array.from(e.dataTransfer.files);
  if (!fileList.length) return;
  console.log(fileList);
  if (fileList.every(item => !/^image/.test(item.type))) {
    ElMessage.error('请不要上传非图片文件');
    return;
  }
  console.log(fileList);
};
const onDragleave = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', false);

};
const onDragenter = (e) => {
  e.preventDefault();
  e.target.toggleAttribute('over', true);
};

const queryData = async () => {
  const res = await fetch(Server.TagAllUseGET, { nsfw: store.nsfw });
  if (!res) return;
  targetList.value = res;
};
onMounted(() => {
  // queryData();
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
    &[over] {
      border-color: var(--color-purple);
      color: var(--color-purple);
    }
  }

  &__tip {
    pointer-events: none;
    user-select: none;
  }
}
</style>
