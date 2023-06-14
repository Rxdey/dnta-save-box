<template>
    <div class="check-box" :class="{checked: value}" @click.stop="onCheck">
        <el-icon :size="18" :color="value ? '#fff' : '#333'">
            <EpSelect />
        </el-icon>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const value = ref(false);

const onCheck = () => {
    value.value = !value.value;
    emit('change', value.value);
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
.check-box {
    --check-box-size: 28px;
    width: var(--check-box-size);
    height: var(--check-box-size);
    background-color: #fff;
    border-radius: var(--check-box-size);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.checked {
        background-color: var(--color-fade-main);
    }
}
</style>
