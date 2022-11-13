<template>
    <div class="homeTab">
        <swiper v-bind="this.swiperOptions">
            <swiper-slide>
                <img src="@/assets/test_1.jpg" :style="this.test_image_style_1">
            </swiper-slide>
            <swiper-slide>
                <img src="@/assets/test_2.jpg" :style="this.test_image_style_2">
            </swiper-slide>
            <div class="swiper-pagination"></div>
        </swiper>
        <div class="about cell">
            <div class="title poppins">About</div>
            <div class="content">
                KAWS의 소개글입니다. KAWS의 소개글입니다. KAWS의 소개글입니다. KAWS의 소개글입니다.
            </div>
            <div class="tagContainer">
                <div class="tag">일러스트</div>
                <div class="tag">그래피티</div>
            </div>
        </div>
        <div class="more cell">
            <div class="title poppins">More
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L7 7L0.999999 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import SwiperCore, { Pagination } from 'swiper';
    import { cropImage } from '@/modules/image';
    import "swiper/css/pagination";

    SwiperCore.use([Pagination]);

    export default {
        name: 'HomeTab',
        components: {
            Swiper,
            SwiperSlide,
        },
        data() {
            return {
                swiperOptions: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: false,
                    centeredSlides: true,
                    pagination: {
                        el: '.swiper-pagination'
                    }
                },
                test_image_style_1: null,
                test_image_style_2: null
            };
        },
        beforeCreate() {},
        async created() {
            let test_image_src_1 = require('@/assets/test_1.jpg')
            let test_image_src_2 = require('@/assets/test_2.jpg')
            this.test_image_style_1 = await cropImage(test_image_src_1, 0.96)
            this.test_image_style_2 = await cropImage(test_image_src_2, 0.96)
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../../scss/ProfilePage/homeTab.scss"></style>