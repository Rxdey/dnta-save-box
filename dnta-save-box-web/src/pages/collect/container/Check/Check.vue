<template>
    <teleport to="body">
        <transition name="slide">
            <div class="popup" v-if="drawer" @click.stop>
                <div class="check-tip">已选择 {{ checkList.length }} 项, 当前页共加载 {{ favoriteList.length }} 项</div>
                <span class="check-all" @click.stop="onCheckAll">全选</span>
                <span class="check-all" @click.stop="onCheckAll(false)">取消</span>
                <div class="popup-right">
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
import useDragStore from '@/store/modules/useDragStore';
import { useFetch } from '@/hooks/useFetch';
import * as Server from '@/service/model/api';

const route = useRoute();
const store = useDragStore();
const drawer = ref(false);
const checkList = computed(() => store.checkList);
const favoriteList = computed(() => store.favoriteList);
const active = computed(() => route.params.type);

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
        const res = await useFetch(Server.FavoriteBatchDelUsePOST, {
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

watch(() => checkList.value, val => {
    console.log(val);
    drawer.value = !!val.length;
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
