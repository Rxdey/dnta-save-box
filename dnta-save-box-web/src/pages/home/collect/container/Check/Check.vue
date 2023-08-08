<template>
    <teleport to="body">
        <transition name="slide">
            <div class="popup" v-if="drawer" @click.stop>
                <div class="check-tip">已选择 {{ checkList.length }} 项, 当前页共加载 {{ favoriteList.length }} 项</div>
                <span class="check-all">
                    <el-switch v-model="check" :inactive-value="1" style="--el-switch-on-color: #5dca91; --el-switch-off-color: #ff4242;--el-color-primary: #f101eb;" :active-value="0" active-text="SFW" inactive-text="NSFW" @change="onUpdate" />
                </span>

                <div class="popup-right">
                    <span class="check-all" @click.stop="onCheckAll">全选</span>
                    <span class="check-all" @click.stop="onCheckAll(false)">取消</span>
                    <span v-if="active === 'recovery'" class="check-all restore" @click="onDeleteAll(false)">恢复</span>
                    <span class="check-all del" @click.stop="onDeleteAll">删除</span>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useMainStore from '@/store/modules/useMainStore';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';

const route = useRoute();
const { fetch } = useFetch();
const store = useMainStore();
const drawer = ref(false);
const checkList = computed(() => store.checkList);
const favoriteList = computed(() => store.favoriteList);
const active = computed(() => route.params.tid);
const check = ref(0);
// 全选
const onCheckAll = (type = true) => {
    store.UPDATE_CHECK_LIST(type ? favoriteList.value : []);
};

// 批量删除
const onDeleteAll = (type = true) => {
    ElMessageBox.confirm(`确定要${type ? '删除' : '恢复'}吗?`, '', {
        confirmButtonText: type ? '删除' : '恢复',
        cancelButtonText: '取消'
    }).then(async () => {
        const ids = checkList.value.map(item => item.id);
        const res = await fetch(Server.FavoriteBatchDelUsePOST, {
            ids,
            is_show: type ? 0 : 1,
            del: active.value === 'recovery' && type ? 1 : 0
        });
        if (!res) return;
        ElNotification({
            title: '操作成功',
            type: 'success'
        });
        store.UPDATE_CHECK_LIST([]);
        store.UPDATE_FAVORITE_LIST(favoriteList.value.filter(item => !ids.includes(item.id)));
    }).catch(() => {

    });
};
// 更新
const onUpdate = async (val) => {
    // console.log(val);
    const ids = checkList.value.map(item => item.id);
    const res = await fetch(Server.FavoriteUpdateUsePOST, {
        ids,
        nsfw: val
    });
    if (!res) return;
    store.UPDATE_FAVORITE_LIST(favoriteList.value.map(item => ({
        ...item,
        nsfw: ids.includes(item.id) ? val : item.nsfw
    })));
    ElNotification({
        title: '操作成功',
        type: 'success'
    });
};
watch(() => checkList.value, val => {
    drawer.value = !!val.length;
    if (!!val.length) {
        check.value = val[0].nsfw
    }
});
onMounted(() => {
    document.body.addEventListener('click', () => {
        if (checkList.value) {
            store.UPDATE_CHECK_LIST([]);
        }
    });
});
</script>

<style lang="less" scoped>
.popup {
    position: fixed;
    background-color: #ffffff;
    left: 0;
    bottom: 0;
    width: 100%;
    min-height: 60px;
    padding: 16px 64px;
    // animation: slideUp 0.3s;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-flow: row;
    align-items: center;
    // justify-content: space-between;
    z-index: 20;

    .popup-right {
        margin-left: auto;
    }

    .check-all {
        cursor: pointer;
        margin-left: 16px;

        &.del {
            color: var(--color-red);
        }

        &.restore {
            color: var(--color-green);
        }

        &:hover {
            color: var(--color-main);
        }
    }
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateY(0%);
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}
</style>
