<template>
    <el-icon :size="18" class="order-icon" :class="{ 'is-loading': props.loading, success: props.success, error: props.error }">
        <span v-show="!props.loading && !props.success && !props.error"><slot></slot></span>
        <EpLoading v-show="props.loading" />
        <EpCheck v-show="props.success" />
        <EpClose v-show="props.error" />
    </el-icon>
</template>

<script setup>
// import { ref } from 'vue';
// import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    success: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
})

</script>

<style lang="less">
.order-icon {
    cursor: pointer;
    transition: all .3s;
    &:hover {
        color: var(--color-main);
    }

    &.desc {
        transform: rotate(-180deg);
    }

    &.success {
        color: var(--color-green);
    }

    &.error {
        color: var(--color-red);
    }
}</style>
