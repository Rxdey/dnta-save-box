import { ref, onMounted, computed } from 'vue';
import useDragStore from '@/store/modules/useDragStore';
import { BASE_URL } from '@/service/api.config';

/**
 * 加载无限滚动列表
 * @returns 
 */
export default function useFetchScroll() {
    const loading = ref(false);
    const finished = ref(false);
    const page = ref(1);
    const pageSize = ref(30);
    const store = useDragStore();

    const fetchData = async (request, params) => {
        if (finished.value) return;
        loading.value = true;
        const res = await request(params);
        loading.value = false;
        const { data, success, msg } = res;
        if (!success) {
            ElMessage.error(msg);
            finished.value = true;
            return;
        }
        finished.value = data.list.length < pageSize.value;
        const list = store.favoriteList.concat(...data.list.map(item => {
            return {
                ...item,
                path: item.path ? item.path.replace('./download', BASE_URL) : ''
            };
        }));
        store.UPDATE_FAVORITE_LIST(list);
        page.value += 1;
    };
    return {
        fetchData,
        finished,
        loading,
        page,
        pageSize
    };
};