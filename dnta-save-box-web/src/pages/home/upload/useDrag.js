import { ref } from 'vue';

export const useDrag = (cb = () => { }) => {
    const uploadLoading = ref(false);

    const onDrop = (e) => {
        e.preventDefault();
        e.target.toggleAttribute('over', false);
        if (uploadLoading.value) return;
        cb(e.dataTransfer.files);
    };
    const onDragleave = (e) => {
        e.preventDefault();
        e.target.toggleAttribute('over', false);

    };
    const onDragenter = (e) => {
        e.preventDefault();
        e.target.toggleAttribute('over', true);
    };
    const onFileChange = (e) => {
        cb(e.target.files);
    };
    
    return {
        uploadLoading,
        onDrop,
        onDragleave,
        onDragenter
    };
};