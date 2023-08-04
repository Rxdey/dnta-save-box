import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home/home.vue'),
        children: [
            {
                path: 'collect/:tid?/:type?',
                name: 'collect',
                component: () => import('@/pages/collect/collect.vue'),
            },
            {
                path: 'upload',
                name: 'upload',
                component: () => import('@/pages/upload/upload.vue'),
            },
        ]
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
