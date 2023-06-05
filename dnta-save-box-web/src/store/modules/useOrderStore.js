import { defineStore } from 'pinia'
import { ProjectInfoResponse, getProjectInfo } from '@/service/model/order';

export const useOrderStore = defineStore('order', {
    state: () => ({
        projectInfo: null,
        fromData: null
    }),
    actions: {
        async GET_PROJECT_INFO({ userId = '', prodCode = '' }) {
            if (this.projectInfo) return this.projectInfo;
            const res = await getProjectInfo({ userId, prodCode, isShare: 'Y' });
            const { data, code, message } = res;
            if (code !== '0000') {
                ElMessage.error(message);
                return null;
            }
            this.projectInfo = data;
            return data;
        },
        async UPDATE_FROM_DATA (data) {
            this.fromData = {
                ...this.fromData,
                ...data,
            }
        }
    }
})