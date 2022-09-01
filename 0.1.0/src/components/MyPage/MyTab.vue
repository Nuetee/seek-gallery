<template>
    <div class="myTab">
        <NavigationBar ref="navigationBar" @clickNavigationButton="this.slideChangeByNavigation"></NavigationBar>
        <div class="tabBody">
            <swiper v-bind="this.swiperOptions" @slideChange="this.slideChangeBySwiper">
                <swiper-slide>
                    <QRTab ref="qrTab"></QRTab>
                </swiper-slide>
                <swiper-slide>
                    <ArchiveTab ref="archiveTab"></ArchiveTab>
                </swiper-slide>
                <div class="nextButton"></div>
                <div class="prevButton"></div>
            </swiper>
        </div>
    </div>
</template>
<script>
    import NavigationBar from '@/widgets/NavigationBar.vue';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import SwiperCore, { Navigation } from 'swiper';
    import ArchiveTab from '../../widgets/ArchiveTab.vue'
    import QRTab from '../../widgets/QRTab.vue';

    SwiperCore.use([Navigation])

    export default {
        name: '',
        components: {
        NavigationBar,
        Swiper,
        SwiperSlide,
        ArchiveTab,
        QRTab
    },
        data() {
            return {
                swiperOptions: {
                    slidesPerView: 1,
                    loop:false,
                    centeredSlides : true,
                    allowTouchMove: true,
                    navigation: {
                        nextEl: '.nextButton',
                        prevEl: '.prevButton'
                    }
                },
                updateInProgress: false,
                slideChangeLock: false
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
          /*
            * - Navigation Button이 눌렸을 경우 호출되는 함수.
            * 1. 활성 버튼과 클릭한 버튼이 같으면 그대로 return.
            * 2. 활성 버튼보다 클릭 버튼의 순서가 뒤인 경우 next slide 로 넘김.
            * 3. 활성 버튼보다 클릭 버튼의 순서가 잎인 경우 previous slide 로 넘김.
            * 4. 버튼의 활성 여부에 따라 버튼의 font color 지정
            * 5. clickedButton의 order를 activeSlideOrder에 저장
            * 6. 부모 component에 바뀐 활성 버튼의 순서를 전달.
            */
            slideChangeByNavigation (preActivatedButton, clickedButton) {
                if (preActivatedButton === clickedButton) {
                    return
                }
                else if (preActivatedButton < clickedButton) { 
                    this.slideChangeLock = true
                    document.getElementsByClassName('nextButton')[0].click()
                }
                else {
                    this.slideChangeLock = true
                    document.getElementsByClassName('prevButton')[0].click()
                }
            },
            slideChangeBySwiper (swiper) {
                if (this.slideChangeLock) {
                    this.slideChangeLock = false
                    return
                }
                let activeIndex = swiper.activeIndex
                this.$refs.navigationBar.index = activeIndex
                this.$refs.navigationBar.preActivatedButton = activeIndex
            },
            async load () {
                if (this.updateInProgress) {
                    return false
                }
                
                this.updateInProgress = true
                const activeIndex = this.$refs.navigationBar.index

                if (activeIndex === 0) {
                    await this.$refs.qrTab.load()
                    await this.$refs.archiveTab.load()
                }
                else {
                    await this.$refs.archiveTab.load()
                    await this.$refs.qrTab.load()
                }
                this.updateInProgress = false
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/myTab.scss"></style>