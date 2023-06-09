import { defineStore } from 'pinia';
import { uniqueArray } from '@/utils';

const useDragStore = defineStore('drag', {
    state: () => ({
        dragData: null,
        favoriteList: [], // 当前收藏列表，不做缓存
        active: -1, // 当前激活的分组，用于校验拖拽时是否移除
        nsfw: 0,
        type: '',
        sort: 'DESC'
    }),
    actions: {
        async UPDATE_SORT(data) {
            this.sort = data ? 'ASC' : 'DESC';
        },
        async UPDATE_TYPE(data) {
            this.type = data;
        },
        async UPDATE_NSFW(data) {
            this.nsfw = data ? 1 : 0;
        },
        async UPDATE_DRAG_DATA(data) {
            this.dragData = data;
        },
        async UPDATE_FAVORITE_LIST(data) {
            this.favoriteList = uniqueArray(data);
        },
        async UPDATE_ACTIVE(data) {
            this.active = data;
        }
    }
});

export default useDragStore