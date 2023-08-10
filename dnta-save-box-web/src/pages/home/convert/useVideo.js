import { ref, watch } from 'vue';

export const useVideo = () => {
    const paused = ref(true);
    const volume = ref(0);
    const muted = ref(true);

    const onVolumeChange = () => {
        muted.value = !muted.value;
        video.value.muted = muted.value;
    };

    const onVoiceClick = (e) => {
        const ract = e.target.getBoundingClientRect();
        const x = e.clientX - ract.left;
        volume.value = (x / (ract.width / 100)) / 100;
    };
};
