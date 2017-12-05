<!--
    Created by haiying_zheng on 2017/08/02.
-->
<template>
    <div class="carousel-wrapper" ref="wrapper" :style="{ width: `${wrapperWidth}` }">
        <ul class="carousel-list" :style="{height: `${carouselHeight}px`}"
            @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <slot></slot>
        </ul>

        <slot name="other"></slot>

        <div v-if="paginationVisible" class="carousel-pagination" :style="{textAlign: `${paginationAlign}`}">
            <span v-if="paginationType == 'bullets'" v-for="(item, index) in items" class="pagination-bullet" :class="{ active: currentIndex === index }"></span>
            <span v-if="paginationType == 'fraction'" class="pagination-number">{{currentIndex + 1}}/{{items.length}}</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .carousel-wrapper {
        position: relative;
        overflow: hidden;
        .carousel-list {
            position: relative;
            list-style: none;
            overflow: hidden;
            .carousel-item {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                width: 100%;
                height: 100%;
            }
        }
        .carousel-pagination {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 10px;
            z-index: 11;
            padding: 0 10px;
            pointer-events: none;
            .pagination-bullet {
                display: inline-block;
                margin: 0 2px;
                height: 5px;
                width: 5px;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 2px;
                transition: all 0.1s ease-in-out;
                &.active {
                    background-color: rgba(256, 256, 256, 0.8);
                }
            }
            .pagination-number {
                padding: 3px 6px;
                color: #fff;
                font-size: 13px;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 15px;
            }
        }
    }
</style>

<script>
    export default {
        name: 'carousel',
        props: {
            width: Number,
            height: Number,
            proportion: Number, //宽高比
            interval: {
                type: Number,
                default: 3000
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            paginationHide: {
                type: Boolean,
                default: false
            },
            paginationType: {
                type: String,
                default: 'bullets'
            },
            paginationAlign: {
                type: String,
                default: 'right' //left center right
            },
            listData: Array
        },
        data() {
            return {
                items: [],
                speed: 300,
                autoPlayTimer: null,
                delayTimer: null,

                currentIndex: 0,
                nextIndex: null,
                prevIndex: null,

                wrapperWidth: 'auto',
                carouselWidth: null,
                carouselHeight: null,

                //滑动相关参数
                distance: 0,
                startTime: null,
                startX: 0
            }
        },
        computed: {
            threshold() {
                return Math.round(this.carouselWidth / 2);
            },
            quickThreshold() {
                return Math.round(this.carouselWidth / 10);
            },
            paginationVisible() {
                return !this.paginationHide && this.items.length > 1;
            }
        },
        watch: {
            listData() {
                this.$nextTick(this.init);
            }
        },
        mounted() {
            //获取宽度(除非指定宽度，否则去外层容器的宽度)
            if (this.width) {
                this.carouselWidth = this.width;
                this.wrapperWidth = this.width + 'px';
            } else {
                this.carouselWidth = this.$refs.wrapper.offsetWidth;
            }

            this.init();
        },
        deactivated() { //如果使用了keep-alive 那么组件缓存时要停止自动播放
            this.stopAutoPlay();
        },
        activated() {
            this.setAutoPlay();
        },
        methods: {
            init() {
                this.currentIndex = 0;
                this.items = this.$children.filter(child => child.$options.name === 'carouselItem');
                this.autoPlayTimer && clearTimeout(this.autoPlayTimer);
                this.delayTimer && clearTimeout(this.delayTimer);

                //计算高度
                if (this.items.length === 0) {
                    this.carouselHeight = 0;
                } else if (this.height) {
                    this.carouselHeight = this.height;
                } else if (this.proportion) {
                    this.carouselHeight = Math.round(this.carouselWidth / this.proportion) || 0;
                } else {
                    this.carouselHeight = Math.round(this.carouselWidth / 2);
                }

                if (this.items.length > 1) {
                    this.setTranslate();
                    this.setAutoPlay();
                }

                this.$emit('change', this.currentIndex);
            },
            setTranslate() {
                let length = this.items.length,
                    current = this.currentIndex,
                    next = (current + 1) % length,
                    prev = (current - 1 + length) % length,
                    defaultTranslateX = this.carouselWidth * 2;

                this.items.forEach(item => {
                    item.slideTo(defaultTranslateX);
                });

                this.items[prev].slideTo(-this.carouselWidth);
                this.items[current].slideTo(0);
                this.items[next].slideTo(this.carouselWidth);

                this.nextIndex = next;
                this.prevIndex = prev;
            },

            handleTouchStart(e) {
                //只有page>1时才执行
                if (this.items.length <= 1) {
                    return
                }

                //取消下一次autoPlay
                this.autoPlayTimer && clearTimeout(this.autoPlayTimer);

                this.delayTimer && clearTimeout(this.delayTimer);
                this.setTranslate();

                this.startX = e.touches[0].clientX;
                this.distance = 0;
                this.startTime = new Date().getTime();
            },
            handleTouchMove(e) {
                //只有page>1时才执行
                if (this.items.length <= 1) {
                    return
                }

                e.preventDefault();
//                e.stopPropagation();

                this.distance = e.touches[0].clientX - this.startX;

                if (this.distance > 0) {
                    this.items[this.prevIndex].slideTo(-this.carouselWidth + this.distance);

                    if (this.items.length >= 3) {
                        this.items[this.nextIndex].slideTo(this.carouselWidth + this.distance);
                    }
                } else {
                    this.items[this.nextIndex].slideTo(this.carouselWidth + this.distance);

                    if (this.items.length >= 3) {
                        this.items[this.prevIndex].slideTo(-this.carouselWidth + this.distance);
                    }
                }

                this.items[this.currentIndex].slideTo(this.distance);
            },
            handleTouchEnd(e) {
                //只有page>1时才执行
                if (this.items.length <= 1) {
                    return;
                }

                if (this.distance === 0) {
                    this.setAutoPlay();
                    return;
                }

                let isQuickAction = new Date().getTime() - this.startTime < 500;

                if ((isQuickAction && this.distance > this.quickThreshold) || this.distance > this.threshold) {
                    this.slideTo(this.currentIndex - 1);
                } else if ((isQuickAction && this.distance < -this.quickThreshold) || this.distance < -this.threshold) {
                    this.slideTo(this.currentIndex + 1);
                } else {
                    this.slideTo(this.currentIndex);
                }
            },

            delayReset() {
                this.delayTimer && clearTimeout(this.delayTimer);
                this.delayTimer = setTimeout(() => {
                    this.setTranslate();
                    this.setAutoPlay();
                }, this.speed);
            },
            slideTo(newCurrentIndex) {
                let length = this.items.length;

                newCurrentIndex = (newCurrentIndex + length) % length;

                if (this.distance > 0) { //向右滑
                    if (newCurrentIndex === this.currentIndex) {
                        this.items[this.prevIndex].slideTo(-this.carouselWidth, this.speed);
                    } else {
                        this.items[this.currentIndex].slideTo(this.carouselWidth, this.speed);
                    }
                } else {
                    if (newCurrentIndex === this.currentIndex) {
                        this.items[this.nextIndex].slideTo(this.carouselWidth, this.speed);
                    } else {
                        this.items[this.currentIndex].slideTo(-this.carouselWidth, this.speed);
                    }
                }

                this.items[newCurrentIndex].slideTo(0, this.speed);

                if (this.currentIndex !== newCurrentIndex) {
                    this.currentIndex = newCurrentIndex;
                    this.$emit('change', newCurrentIndex);
                }

                this.delayReset();
            },

            setAutoPlay() {
                if (this.autoPlay && this.items.length > 1) {
                    this.distance = 0;
                    this.autoPlayTimer && clearTimeout(this.autoPlayTimer);
                    this.autoPlayTimer = setTimeout(() => {
                        this.slideTo(this.currentIndex + 1);
                    }, this.interval);
                }
            },
            stopAutoPlay() {
                this.autoPlayTimer && clearTimeout(this.autoPlayTimer);
            }
        }
    }
</script>