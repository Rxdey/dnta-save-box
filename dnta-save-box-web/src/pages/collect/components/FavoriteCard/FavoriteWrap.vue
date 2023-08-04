<template>
  <div class="favorite-wrap">
    <slot></slot>
    <el-dialog v-model="dialogVisible" title="编辑收藏" :before-close="handleClose" append-to-body class="edit-dialog" draggable destroy-on-close>
      <div class="edit-container">
        <div class="edit-form-item">
          <p class="label">标题</p>
          <Field placeholder="输入标题" v-model="form.title" />
        </div>
        <div class="edit-form-item">
          <p class="label">描述</p>
          <Field placeholder="输入描述" v-model="form.desc_txt" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleUpdate" :loading="loading">更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';
import useUpdate from '@/hooks/useUpdate';

const store = useDragStore();
const { loading, fetchData } = useUpdate();
const dialogVisible = ref(false);

const selectEdit = computed(() => store.selectEdit);
const editShow = computed(() => store.editShow);

const form = ref({
  title: '',
  desc_txt: ''
});

const handleClose = (done) => {
  done();
};

const handleUpdate = async () => {
  const res = await fetchData(Server.FavoriteUpdateUsePOST, {
    id: selectEdit.value.id,
    ...form.value
  });
  if (!res) return;
  store.UPDATE_FAVORITE_BY_ID({
    id: selectEdit.value.id,
    ...form.value
  });
  dialogVisible.value = false;
  ElNotification({
    title: '操作成功',
    message: '已更新',
    type: 'success'
  });
};

onMounted(() => {
  dialogVisible.value = editShow.value;
});

watch(() => editShow.value, val => {
  if (val) {
    form.value = {
      title: selectEdit.value.title,
      desc_txt: selectEdit.value.desc_txt,
    };
  }
  dialogVisible.value = val;
});
watch(() => dialogVisible.value, val => {
  if (!val) store.UPDATE_SELECT_EDIT(null);
  store.UPDATE_EDIT_SHOW(val);
})

</script>

<style lang="less">
@import url('./index.less');
</style>
