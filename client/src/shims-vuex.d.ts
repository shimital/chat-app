import { Store } from '@/store';
import VueConstructor from 'vue';

declare module 'vue/types/vue' {

    interface Vue {
        $store: Store;
    }
}
