<template>
    <div id="myPage2">
        <div class="header" :class="this.tab_index ? 'hidingSearchBox' : ''">
            <div class="logoBox">
                <img src="../assets/seek_logo.png">
            </div>
            <div class="profileControlContainer" v-if="this.tab_index">
                <div class="profileControlButton"
                    @click="(event) => { this.show_control_box = !this.show_control_box; this.stopPropagation(event)}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="profileControlBox" v-show="this.show_control_box">
                    <div v-if="this.user !== null">
                        <div>프로필 편집</div>
                        <div>
                            <a class="reportButton" :href="this.reportURL">
                                피드백
                            </a>
                        </div>
                        <div @click="this.logOut">로그아웃</div>
                    </div>
                    <div v-else>
                        <div>
                            <a class="reportButton" :href="this.reportURL">
                                피드백
                            </a>
                        </div>
                        <div @click="this.logIn">로그인</div>
                    </div>
                </div>
            </div>
            <div class="searchBox">
                <div class="searchButton">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                            stroke="#8A8A8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.5 17.5L13.875 13.875" stroke="#8A8A8A" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="keyword">
                    <input type="text" placeholder="키워드를 검색하세요!">
                </div>
            </div>
        </div>
        <div class="tabsBackground">
            <div class="tabs">
                <div class="tab" v-for="tab, tab_index in ['탐색', 'MY']" :key="tab" @click="this.clickTab(tab_index)">
                    {{ tab }}
                </div>
                <div class="tab_content"></div>
            </div>
        </div>
        <swiper class="subPages" v-bind="this.swiperOptions">
            <swiper-slide class="explorePageSlide">
                <SubPageExplore ref="subPageExplore"></SubPageExplore>
            </swiper-slide>
            <swiper-slide class="myPageSlide">
                <SubPageMy ref="subPageMy"></SubPageMy>
            </swiper-slide>
            <div class="nextButton"></div>
            <div class="prevButton"></div>
        </swiper>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import SubPageMy from '../components/MyPage/SubPage_my.vue'
    import SubPageExplore from '../components/MyPage/SubPage_explore.vue'
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import SwiperCore, { Navigation } from 'swiper';import {
        isAuth,
        getAuth,
        logout
    } from '@/modules/auth'

    SwiperCore.use([Navigation])

    export default {
        name: 'MyPage',
        components: {
            MainHeader,
            SubPageMy,
            SubPageExplore,
            Swiper,
            SwiperSlide,
        },
        data() {
            return {
                user: null,
                show_control_box: false,
                timeout_flag: null,
                tab_index: 0,
                swiperOptions: {
                    slidesPerView: 1,
                    loop: false,
                    centeredSlides: true,
                    allowTouchMove: false,
                    navigation: {
                        nextEl: '.nextButton',
                        prevEl: '.prevButton'
                    }
                },
                reportURL: 'https://forms.gle/GY7jhsnJAcHLK3nw5'
            };
        },
        beforeCreate() {},
        created() {
            if (isAuth()) {
                this.user = getAuth()
            }
        },
        beforeMount() {},
        mounted() {
            document.getElementsByClassName('tab')[0].style.color = 'white'
            document.getElementsByClassName('tab')[1 - this.tab_index].style.color = 'black'
            clearTimeout(this.timeout_flag)
            let searchBox = document.getElementsByClassName('searchBox')[0]
            searchBox.style.visibility = 'visible'

            // const _this = this
            // let subpage_slides = document.getElementsByClassName('swiper-slide')
            // for (let swiper_slide of subpage_slides) {
            //     swiper_slide.addEventListener('scroll', async function (event) {
            //         _this.swiperSlideScrollEventFunction(event.currentTarget)
            //     })
            // }
        },
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
            clickTab (tab_index) {
                document.getElementsByClassName('tab')[tab_index].style.color = 'white'
                document.getElementsByClassName('tab')[1 - tab_index].style.color = 'black'

                if (tab_index === 0) {
                    document.getElementsByClassName('tab_content')[0].style.left = 0
                    document.getElementsByClassName('tab_content')[0].style.transform = 'translate(0, 0)'
                    clearTimeout(this.timeout_flag)
                    let searchBox = document.getElementsByClassName('searchBox')[0]
                    searchBox.style.visibility = 'visible'
                    document.getElementsByClassName('prevButton')[0].click()
                }
                else {
                    document.getElementsByClassName('tab_content')[0].style.left = '100%'
                    document.getElementsByClassName('tab_content')[0].style.transform = 'translate(-100%, 0)'
                    document.getElementsByClassName('nextButton')[0].click()
                    this.timeout_flag = setTimeout(() => {
                        let searchBox = document.getElementsByClassName('searchBox')[0]
                        searchBox.style.visibility = 'hidden'
                    }, 250)
                }
                this.tab_index = tab_index
            },
            logOut () {
                logout(this.$store.getters.getProvider)
                this.$router.go()
            },
            logIn () {
                this.$router.replace({
                    path: '/login',
                    query: {
                        redirect: this.$route.fullPath
                    }
                })
                return
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MyPage/myPage_2.scss"></style>