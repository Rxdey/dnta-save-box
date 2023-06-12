import { ref, onMounted, computed } from 'vue';

/**
 * 加载无限滚动列表
 * @returns 
 */
export default function useUpdate() {
    const loading = ref(false);
    const fetchData = async (request, params) => {
        loading.value = true;
        const res = await request(params);
        loading.value = false;
        const { data, success, msg } = res;
        if (!success) {
            ElMessage.error(msg);
            return false;
        }
        return data;
    };
    return {
        fetchData,
        loading,
    };
};