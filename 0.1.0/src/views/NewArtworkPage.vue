<template>
    <div id="newArtworkPage">
        <MainHeader :background_color="'transparent'">
            <template v-slot:left>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" @click="this.back()">
                    <path d="M7 13L1 7L7 1" :stroke="(this.artwork ? this.artwork.getColor() : 'black')" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </template>
            <template v-slot:right>
                <RoundProfile :profile="this.profile" @click="this.openSideBar($event)"></RoundProfile>
            </template>
        </MainHeader>
        <swiper class="artworkSlider" v-bind="this.swiperOptions">
            <swiper-slide v-for="(artwork, i) in this.artworkList" :key="i">

            </swiper-slide>
        </swiper>
        <SideBar ref="sideBar"></SideBar>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import SideBar from '@/widgets/SideBar.vue';
    import RoundProfile from '@/widgets/RoundProfile.vue';

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import { isAuth, getAuth } from '@/modules/auth'

    export default {
        name: 'NewArtworkPage',
        components: {
            MainHeader,
            SideBar,
            RoundProfile,
            Swiper,
            SwiperSlide
        },
        props: {
            artworkList: {
                type: Array,
                default: []
            },
            initialIndex: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                artwork: null,
                profile: '',
                swiper_default_options: {
                    direction: vertical,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                }
            };
        },
        computed: {
            swiperOptions () {
                let swiper_options = this.swiper_default_options
                swiper_options.initialSlide = this.initialIndex

                return swiper_options
            }
        },
        beforeCreate() {},
        created() {
            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
             openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/NewArtworkPage/newArtworkPage.scss"></style>