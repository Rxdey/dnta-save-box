<template>
    <div class="field">
        <input class="field-inner" type="text" v-model="value" @keydown.enter="onEnter" v-bind="$attrs"/>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
    modelValue: ''
});
const value = ref('');
const emit = defineEmits(['update:modelValue', 'enter']);

const onEnter = () => {
    emit('enter', value.value);
};
onMounted(() => {
    value.value = props.modelValue;
});
watch(() => props.modelValue, (val) => {
    value.value = val;
});
watch(() => value.value, (val) => {
    emit('update:modelValue', val);
});

</script>

<style lang="less" scoped>
.field {
    position: relative;

    .field-inner {
        border: none;
        outline: none;
        background-color: transparent;
        padding: 8px 0;
        color: var(--color-fade-main);
    }

    &::after,
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--color-gray2);
        transition: all 0.3s;
    }

    &::before {
        width: 0%;
    }

    &:focus-within {
        &::before {
            z-index: 1;
            width: 100%;
            background-color: var(--color-main);
        }
    }
}
</style>
