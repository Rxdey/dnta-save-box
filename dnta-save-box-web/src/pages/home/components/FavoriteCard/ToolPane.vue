<template>
    <div class="ToolPane">
        <p>{{ getTimeAgo(data.update_date) }}</p>
        <div class="footer" v-if="data.type !== 'video'">
            <div class="flex-center" v-if="domain">
                <el-image class="favicon" :src="domain.origin + '/favicon.ico'" lazy fit="cover" draggable="false">
                    <template #error>
                        <el-icon :size="18" color="slateblue">
                            <MdiWeb />
                        </el-icon>
                    </template>
                </el-image>
                <a :href="data.origin" class="ov-1" :title="data.origin" target="_blank">{{ domain.host }}</a>
            </div>
            <div class="tool-bar">
                <el-icon :size="18" class="edit" title="编辑" v-if="data.is_show === 1">
                    <PhPenThin />
                </el-icon>
                <el-icon :size="18" class="edit restore" title="还原" v-else @click.stop="handleRestore">
                    <IcRoundRestorePage />
                </el-icon>
                <el-icon :size="18" class="edit" title="删除" @click.stop="handleDel">
                    <MdiDeleteForeverOutline />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { getTimeAgo, extractDomain } from '@/utils';
import { PhPenThin, MdiWeb, MdiDeleteForeverOutline, IcRoundRestorePage } from '@/components/Icon';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';

const store = useDragStore();
const data = inject('favoriteData');
const domain = ref(null);

// 恢复
const handleRestore = async () => {
    const res = await Server.FavoriteUpdateUsePOST({
        id: data.id,
        is_show: 1
    });
    const { success, msg } = res;
    if (!success) {
        ElMessage.error(msg);
        return;
    }
    ElNotification({
        title: 'Success',
        message: '已恢复',
        type: 'success'
    });
    store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== data.id));
};
const handleDel = () => {
    ElMessageBox.confirm(`${data.is_show === 0 ? '删除后不可恢复,' : ''}确定要删除吗`, '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    })
        .then(async () => {
            // 回收站的直接移除
            const delApi = data.is_show === 0 ? 'FavoriteDelUsePOST' : 'FavoriteUpdateUsePOST';
            const params = {
                id: data.id,
            };
            if (data.is_show) params.is_show = 0;
            const res = await Server[delApi](params);
            const { success, msg } = res;
            if (!success) {
                ElMessage.error(msg);
                return;
            }
            ElNotification({
                title: 'Success',
                message: data.is_show ? '移除成功, 7天内可在回收站找回' : '已删除',
                type: 'success'
            });
            store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== data.id));
        })
        .catch(() => { });
};

onMounted(() => {
    domain.value = extractDomain(data.origin);
});

</script>

<style lang="less"></style>
