import { ref, onMounted, computed } from 'vue';
import useDragStore from '@/store/modules/useDragStore';
import { BASE_URL } from '@/service/api.config';

const extname = (path = '') => {
    return path.split('.')[path.split('.').length - 1];
};
/**
 * 加载无限滚动列表
 * @returns 
 */
export function useFetchScroll() {
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
                videoPath: item.path ? item.path.replace('./download/', BASE_URL) : '',
                cover: item.cover ? item.cover.replace('./download/', BASE_URL) : '',
                // thumb: (item.path && extname(item.path) !== 'webp') ? `${BASE_URL}view?url=${item.path}` : ''
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

/**
 * 加载数据
 * callBack和promise
 * @returns 
 */
export function useFetch() {
    const loading = ref(false);
    const fetch = async (request, params, callBack = () => { }, errorBack = () => { }) => {
        loading.value = true;
        const res = await request(params);
        loading.value = false;
        const { data, success, msg } = res;
        if (!success) {
            ElMessage.error(msg);
            errorBack();
            return false;
        }
        callBack(data);
        return data;
    };
    return {
        fetch,
        loading,
    };
};