import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/pages/home/home.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/index/index.vue'),
        children: [
            {
                path: 'collect/:tid?/:type?',
                name: 'collect',
                component: () => import('@/pages/collect/collect.vue'),
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
