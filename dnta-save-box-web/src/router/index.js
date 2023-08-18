import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/home/collect/all'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home/home.vue'),
        children: [
            {
                path: 'collect/:tid',
                name: 'collect',
                component: () => import('@/pages/home/collect/collect.vue'),
            },
            {
                path: 'upload',
                name: 'upload',
                component: () => import('@/pages/home/upload/upload.vue'),
            },
            {
                path: 'convert',
                name: 'convert',
                component: () => import('@/pages/home/convert/convert.vue'),
            },
        ]
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/pages/home/convert/convert.vue'),
    },
    {
        path: '/canvas',
        name: 'canvas',
        component: () => import('@/pages/canvas/canvas.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login/login.vue'),
    },
];

const router = createRouter({
    // history: createWebHistory('/pc/'),
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
});

export default router;
