import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Vnode from '@/components/Loadingbar/index'
import { getToken } from '@/utils/cookies'
import { estimateAuth } from "@/utils/auth"
import pinia from '@/store/store'
import { useInfo } from "@/store"
import { getInfo } from '@/api/api'

declare module 'vue-router' {
    interface RouteMeta {
        title: string;
        requireAuth: boolean;
        transition?: string;
    }
}
const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        alias: '/home',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: '主页',
            requireAuth: true,
            transition: 'animate__fadeIn'
        },
        children: [
            {
                path: 'report',
                name: '举报受理',
                component: () => import('@/pages/Report.vue')
            },
            {
                path: 'content',
                name: '内容管理',
                component: () => import('@/pages/Content.vue')
            },
            {
                path: 'user',
                name: '用户管理',
                component: () => import('@/pages/User.vue')
            },
            {
                path: 'record',
                name: '操作日志',
                component: () => import('@/pages/Record.vue')
            },
            {
                path: 'info',
                name: '个人信息',
                component: () => import('@/pages/Info.vue')
            },
            {
                path: 'notice',
                name: '公告管理',
                component: () => import('@/pages/Notice.vue')
            },
            {
                path: 'tag',
                name: 'tag 标签管理',
                component: () => import('@/pages/Tag.vue')
            },
            {
                path: 'word',
                name: '敏感词条',
                component: () => import('@/pages/Word.vue')
            },
            {
                path: 'department',
                name: '校务 | 部门管理',
                component: () => import('@/pages/Department.vue')
            },
            {
                path: 'dispatch',
                name: '权限分配',
                component: () => import('@/pages/Dispatch.vue')
            },
            {
                path: 'game',
                name: '游戏管理',
                component: () => import('@/pages/Game.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录',
            requireAuth: false,
            transition: 'animate__fadeIn'
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About.vue'),
        meta: {
            title: '关于我们',
            requireAuth: false,
            transition: 'animate__fadeIn'
        }
    },
]
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (to, from, savePosition) => {
        if (savePosition) return savePosition;
        else return {
            top: 0
        }
    }
})

const Info = useInfo(pinia);
router.beforeEach((to, from, next) => {
    Vnode.component?.exposed?.startLoading();
    if (!Object.keys(to.meta).length) next('/')
    else if (!to.meta.requireAuth) next();
    else if (getToken()) {
        if (Info.auth.length) next();
        else getInfo({ token: getToken()})
            .then((res: any) => {
                if (res) {
                    let auth = estimateAuth(res.user_info);
                    Info.$patch({...res.user_info, auth});
                    next();
                } else next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                })
            })
    }
    else next({
        path: '/login',
        query: {
            redirect: to.fullPath
        }
    });
    document.title = to.meta.title
})
router.afterEach((to, from, next) => {
    Vnode.component?.exposed?.endLoading();
})
export default router