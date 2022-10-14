<template>
    <div class="artworkImageSlider">
        <swiper v-bind="this.swiperOptions" v-if="this.artwork_image_information_list">
            <swiper-slide v-for="(image_information, i) in this.artwork_image_information_list" :key="i">
                <div class="image" v-if="image_information.style !== 'video'">
                    <img class="background" :src="image_information.src" :style="image_information.background_style">
                    <img class="main" :src="image_information.src" :style="image_information.style">
                </div>
                <div v-else class="video">
                    <img :src="image_information.background_src" :style="image_information.background_style">
                    <video @click="this.stopPropagation($event)" :src="image_information.src" controls></video>
                </div>
            </swiper-slide>
            <div class="swiper-pagination"></div>
        </swiper>
        <div class="blankSpace" v-else></div>
    </div>
</template>
<script>
    import SwiperCore, { Pagination } from 'swiper';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import  'swiper/css/pagination'

    SwiperCore.use([Pagination]);

    export default {
        name: 'ArtworkImageSlider',
        components: {
            Swiper,
            SwiperSlide
        },
        props: {
            artwork_image_information_list: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                swiperOptions: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                    pagination: {
                        el: '.swiper-pagination'
                    }
                }
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            stopPropagation(event) {
                // event 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응
            },
        }
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkImageSlider.scss"></style>