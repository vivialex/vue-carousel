<!--
    Created by haiying_zheng on 2017/08/02.
-->
<template>
    <li class="carousel-item" :style="{transition: `all ${transitionDuration}ms ease`, transform: `translate3d(${translateX}px, 0px, 0px)`}">
        <slot></slot>
    </li>
</template>

<script>
    export default {
        name: 'carouselItem',
        data() {
            return {
                translateX: 0,
                transitionDuration: 0
            }
        },
        methods: {
            slideTo(x, transitionDuration) {
                this.transitionDuration = transitionDuration || 0;
                this.translateX = x;
            }
        }
    }
</script>