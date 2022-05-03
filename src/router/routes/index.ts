export const sidebarRoutes: AuthRoute.Route[] = [
    {
        name: 'home',
        path: '/home',
        component: 'self',
        meta: {
            title: '主页',
            icon: 'mdi:clipboard-account',
            requiresAuth: true,
            singleLayout: 'basic'
        }
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        component: 'self',
        meta: {
            title: '仪表盘',
            icon: 'mdi:clipboard-account',
            requiresAuth: true,
            singleLayout: 'basic'
        }
    },
    {
        name:'test',
        path: '/test',
        component: 'self',
        meta: {
            title: '测试',
            icon: 'ion:logo-alipay',
            requiresAuth: true,
            singleLayout: 'basic'
        }
    }
];

/** 固定的路由 */
export const constantRoutes: AuthRoute.Route[] = [
    {
        name: 'root',
        path: '/',
        redirect: '/home',
        meta: {
            title: '主页'
        }
    },
    {
        name: 'login',
        path: '/login',
        component: 'self',
        meta: {
            title: '登录'
        }
    },
    {
        name: 'active',
        path: '/active',
        component: 'self',
        meta: {
            title: '激活'
        }
    },
    {
        name: 'no-permission',
        path: '/no-permission',
        component: 'self',
        meta: {
            title: '无权限',
            singleLayout: 'blank'
        }
    },
    {
        name: 'not-found',
        path: '/not-found',
        component: 'self',
        meta: {
            title: '未找到',
            singleLayout: 'blank'
        }
    },
    {
        name: 'service-error',
        path: '/service-error',
        component: 'self',
        meta: {
            title: '服务器错误',
            singleLayout: 'blank'
        }
    },
    // 匹配无效路径的路由
    {
        name: 'not-found-page',
        path: '/:pathMatch(.*)*',
        component: 'blank',
        meta: {
            title: '未找到!',
            singleLayout: 'blank'
        }
    },
    ...sidebarRoutes
];

/** 路由名称 */
export const routeName = (key: AuthRoute.RouteKey) => key;

/** 路由路径 */
export function routePath(key: Exclude<AuthRoute.RouteKey, 'not-found-page'>): AuthRoute.RoutePath {
    const rootPath: AuthRoute.RoutePath = '/';
    if (key === 'root') return rootPath;
    const splitMark: AuthRoute.RouteSplitMark = '_';
    const pathSplitMark = '/';
    const path = key.split(splitMark).join(pathSplitMark);
    return (pathSplitMark + path) as AuthRoute.RoutePath;
}
