import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import UserEntrance from '../components/UserEntrance.vue';
import ChatDisplay from '../components/ChatDisplay.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/chat/:name',
        name: 'chat',
        component: ChatDisplay,
        beforeEnter: (to: Route, from: Route, next) => {
            const routeUsername: string = to.params[ 'name' ];
            const storeUsername: string = store.state.username;

            if (!routeUsername || storeUsername !== routeUsername) {
                next('/');
            }

            next();
        }
    },
    {
        path: '/',
        name: 'entrance',
        component: UserEntrance,
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;
