/**
 * Created by rd_haiying_zheng on 2017/8/1.
 */
import carousel from './carousel.vue';
import carouselItem from './carousel-item.vue';

export default {
    install(Vue) {
        Vue.component(carousel.name, carousel);
        Vue.component(carouselItem.name, carouselItem);
    }
}