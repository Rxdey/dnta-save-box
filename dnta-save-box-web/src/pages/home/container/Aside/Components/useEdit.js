import { ref, onMounted } from 'vue';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';

export const useEdit = (store, emit) => {
    const { loading, fetch } = useFetch();
    // 编辑弹窗
    const dialogVisible = ref(false);
    const selectTag = ref(null);
    const lastName = ref('');

    /** 删除标签 */
    const onDel = () => {
        dialogVisible.value = false;
        ElMessageBox.confirm('删除收藏夹后，所有收藏将被移动至 未分类收藏，是否继续删除？', '警告', {
            confirmButtonText: '删除',
            cancelButtonText: '取消'
        }).then(async () => {
            const res = await fetch(Server.TagDelUsePOST, {
                id: selectTag.value.id,
            });
            if (!res) return;
            ElNotification({
                title: '操作成功',
                message: '已删除',
                type: 'success',
            });
            emit('del', selectTag.value.id);
        }).catch(() => {
            dialogVisible.value = true;
        });
    };
    /** 编辑标签 */
    const onUpdateTag = async () => {
        const res = await fetch(Server.TagUpdateUsePOST, {
            id: selectTag.value.id,
            name: selectTag.value.name,
            nsfw: selectTag.value.nsfw
        });
        if (!res) {
            selectTag.value.name = lastName.value;
            return;
        }
        lastName.value = '';
        dialogVisible.value = false;
        ElNotification({
            title: '操作成功',
            message: '更新成功',
            type: 'success',
        });
    };
    /** 编辑弹窗 */
    const onEdit = (data) => {
        selectTag.value = data;
        lastName.value = data.name;
        dialogVisible.value = true;
    };

    const handleClose = (done) => {
        if (selectTag.value && lastName.value) selectTag.value.name = lastName.value;
        done();
    };
    return {
        onDel,
        onUpdateTag,
        onEdit,
        handleClose,
        selectTag,
        dialogVisible,
        loading
    };
};