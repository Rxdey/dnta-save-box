import { ref, onMounted, computed } from 'vue';

/**
 * 加载数据
 * 后加的，之前的不改了
 * callBack和promise
 * @returns 
 */
export default function useUpdate() {
    const loading = ref(false);
    const fetchData = async (request, params, callBack = () => { }, errorBack = () => { }) => {
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
        fetchData,
        loading,
    };
};