import type { NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router";
import { useRouteStore } from "@/store";

export async function createDynamicRouteGuard(
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
    router: Router
) {
    const route = useRouteStore();
    await route.initDynamicRoute(router);
    return true;
}
