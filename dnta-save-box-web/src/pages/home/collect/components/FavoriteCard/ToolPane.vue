<template>
    <div class="ToolPane">
        <p class="ago">{{ getTimeAgo(data.update_date) }}</p>
        <div class="footer" v-if="data.type !== 'video'">
            <div class="flex-center" v-if="domain">
                <el-image class="favicon" :src="domain.origin + '/favicon.ico'" lazy fit="cover" draggable="false">
                    <template #error>
                        <el-icon :size="18" color="slateblue">
                            <v-icon icon="ic:baseline-web"/>
                        </el-icon>
                    </template>
                </el-image>
                <a :href="data.origin" class="ov-1" :title="data.origin" target="_blank">{{ domain.host }}</a>
            </div>
            <div class="tool-bar">
                <el-icon :size="18" class="edit" title="编辑" v-if="data.is_show === 1" @click.stop="handleEdit">
                    <v-icon icon="mdi:pencil" />
                </el-icon>
                <el-icon :size="18" class="edit restore" title="还原" v-else @click.stop="handleRestore">
                    <v-icon icon="mdi:backup-restore" />
                </el-icon>
                <el-icon :size="18" class="edit" title="删除" @click.stop="handleDel">
                    <v-icon icon="mdi:delete-forever" />
                </el-icon>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue';
import { getTimeAgo, extractDomain } from '@/utils';
import useMainStore from '@/store/modules/useMainStore';
import * as Server from '@/service/model/api';
import useUpdate from '@/hooks/useUpdate';

const store = useMainStore();
const data = inject('favoriteData');
const domain = ref(null);

const { loading, fetchData } = useUpdate();

// 恢复
const handleRestore = async () => {
    const res = await fetchData(Server.FavoriteUpdateUsePOST, {
        id: data.value.id,
        is_show: 1
    });
    if (!res) return;
    ElNotification({
        title: '操作成功',
        message: '已恢复',
        type: 'success'
    });
    store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== data.value.id));
};
// 删除
const handleDel = () => {
    ElMessageBox.confirm(`${data.value.is_show === 0 ? '删除后不可恢复,' : ''}确定要删除吗?`, '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    })
        .then(async () => {
            // 回收站的直接移除
            const delApi = data.value.is_show === 0 ? 'FavoriteDelUsePOST' : 'FavoriteUpdateUsePOST';
            const params = {
                id: data.value.id,
            };
            if (data.value.is_show) params.is_show = 0;
            const res = await fetchData(Server[delApi], params);
            if (!res) return;
            ElNotification({
                title: '操作成功',
                message: data.value.is_show ? '移除成功, 可在回收站找回' : '已删除',
                type: 'success'
            });
            store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== data.value.id));
        })
        .catch(() => { });
};
// 编辑
const handleEdit = () => {
    store.UPDATE_SELECT_EDIT(data.value);
    store.UPDATE_EDIT_SHOW(true);
};

onMounted(() => {
    domain.value = extractDomain(data.value.origin);
});

</script>

<style lang="less"></style>
