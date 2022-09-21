<template>
    <div id="mainPage">
        <MainHeader :background_color="'white'" v-show="this.bodyShowFlag">
            <template v-slot:left>
                <img src="../assets/seek_logo.png">
            </template>
            <template v-slot:right>
                <RoundProfile :profile="this.userThumbnail" @click="this.openSideBar($event)" :color="'black'"></RoundProfile>
            </template>
        </MainHeader>
        <div id="viewPort">
            <div id="loading">
                <div class="notArchive">
                    <div class="eye">
                        <svg class="eyelid" width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.0002 0C13.1921 0 8.67214 1.76831 5.27225 4.97929C1.87235 8.19028 0 12.4591 0 17C0 21.5409 1.87235 25.8101 5.27225 29.0207C8.67179 32.2317 13.1921 34 18.0002 34C22.8083 34 27.3286 32.2317 30.7281 29.0207C32.76 27.1018 34.2897 24.7367 35.1516 22.181L35.2706 21.828H33.571L33.5047 22.0114C32.6954 24.2509 31.3758 26.2454 29.5826 27.9392C26.4888 30.8611 22.3753 32.4703 17.9998 32.4703C13.6243 32.4703 9.51119 30.8611 6.41737 27.9392C3.32356 25.0173 1.70103 21.3148 1.62253 17.2918H35.4767V17.2708H36V17C36 12.4591 34.1277 8.19028 30.7278 4.97929C27.3279 1.76831 22.8079 0 17.9998 0H18.0002ZM18.0002 1.52967C22.3757 1.52967 26.4888 3.13888 29.583 6.06079C31.0027 7.40158 32.1345 8.9458 32.9474 10.6508C33.7173 12.2651 34.1814 13.9833 34.3294 15.7618H1.67128C1.81894 13.9833 2.28344 12.2654 3.05331 10.6508C3.86619 8.9458 4.99806 7.40158 6.41773 6.06079C9.51155 3.13888 13.625 1.52967 18.0002 1.52967Z" fill="white"/>
                        </svg>
                        <svg class="pupil" width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 8C13.1944 8 17 4.41829 17 0H0C0 4.41829 3.80556 8 8.5 8Z" fill="white"/>
                        </svg>
                    </div>
                    <div class="eye">
                        <svg class="eyelid" width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.0002 0C13.1921 0 8.67214 1.76831 5.27225 4.97929C1.87235 8.19028 0 12.4591 0 17C0 21.5409 1.87235 25.8101 5.27225 29.0207C8.67179 32.2317 13.1921 34 18.0002 34C22.8083 34 27.3286 32.2317 30.7281 29.0207C32.76 27.1018 34.2897 24.7367 35.1516 22.181L35.2706 21.828H33.571L33.5047 22.0114C32.6954 24.2509 31.3758 26.2454 29.5826 27.9392C26.4888 30.8611 22.3753 32.4703 17.9998 32.4703C13.6243 32.4703 9.51119 30.8611 6.41737 27.9392C3.32356 25.0173 1.70103 21.3148 1.62253 17.2918H35.4767V17.2708H36V17C36 12.4591 34.1277 8.19028 30.7278 4.97929C27.3279 1.76831 22.8079 0 17.9998 0H18.0002ZM18.0002 1.52967C22.3757 1.52967 26.4888 3.13888 29.583 6.06079C31.0027 7.40158 32.1345 8.9458 32.9474 10.6508C33.7173 12.2651 34.1814 13.9833 34.3294 15.7618H1.67128C1.81894 13.9833 2.28344 12.2654 3.05331 10.6508C3.86619 8.9458 4.99806 7.40158 6.41773 6.06079C9.51155 3.13888 13.625 1.52967 18.0002 1.52967Z" fill="white"/>
                        </svg>
                        <svg class="pupil" width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 8C13.1944 8 17 4.41829 17 0H0C0 4.41829 3.80556 8 8.5 8Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                <div class="phrase poppins">
                    입장 중<span>.</span><span>.</span><span>.</span>
                </div>
            </div>
            <transition-group name="slide-fade" tag="div">
                <div id="body" v-if="this.exhibition" v-show="this.bodyShowFlag">
                    <div class="poster">
                        <img id="posterImage" @load="() => {this.bodyShowFlag = true}" :src="this.poster_image"
                            :style="this.poster_image_style">
                    </div>
                    <div class="exhibitionInformation">
                        <TitleHeader ref="informationTitle" 
                            :document_element_id="'viewPort'" 
                            :title="this.exhibition.getName()" 
                            :startHeight="(this.vw * 30)"
                            :heightUnit="this.vw / 2">
                        </TitleHeader>
                        <pre class="exhibitionIntroduction">
                            {{ this.exhibition.getInformation() }}
                        </pre>
                    </div>
                    <div class="exhibitionArtworks">
                        <TitleHeader ref="artworksTitle" 
                            :title="'Artworks'" 
                            :startHeight="(this.vw * 30)"
                            :heightUnit="this.vw / 2"
                            :document_element_id="'viewPort'">
                        </TitleHeader>
                        <ArtworkTrackList ref="artworkTrackList" 
                            :source="this.source"
                            :artwork_track_list="this.artwork_track_list"
                            :category_list="this.category_list" :proper_position_flag="this.proper_position_flag"
                            :document_element_id="'viewPort'">
                        </ArtworkTrackList>
                    </div>
                    <!-- <div class="exhibitionMoreInformation">
                        <TitleHeader ref="moreInformationTitle" 
                            :title="'전시 더보기'" 
                            :startHeight="(this.vw * 30)"
                            :heightUnit="this.vw / 2"
                            :document_element_id="'viewPort'">
                        </TitleHeader>
                        <div class="video">
                            <div class="videoTitle">Talk that Talk</div>
                            <div class="videoArea">
                                <iframe src="https://www.youtube.com/embed/k6jqx9kZgPM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                        </div>
                        <div class="merchandise">
                            <a href="https://twice.lnk.to/Shop">굿즈 사러가기</a>
                        </div>
                    </div> -->
                </div>
            </transition-group>
        </div>
        <SideBar ref="sideBar"></SideBar>
        <div style="display:none;width:0;height:0;position:fixed;bottom:0;left:0;z-index:0;">{{this.posterImageElement}}</div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import TitleHeader from '@/widgets/TitleHeader.vue';
    import ArtworkTrackList from '@/widgets/ArtworkTrackList.vue';
    import SideBar from '@/widgets/SideBar.vue';
    import RoundProfile from '@/widgets/RoundProfile.vue';

    import { Exhibition } from '@/classes/exhibition';
    import { cropImage } from '@/modules/image';
    import { 
        isAuth, 
        getAuth 
    } from '@/modules/auth';

    export default {
        name: 'MainPage',
        components: {
            MainHeader,
            TitleHeader,
            ArtworkTrackList,
            SideBar,
            RoundProfile
        },
        data() {
            return {
                source: (this.$route.query.utm_source) 
                    ? this.$route.query.utm_source 
                    : '',
                id: this.$route.query.id,
                exhibition: null,
                artwork_track_list: [],
                category_list: [],
                proper_position_flag: false,

                poster_image: null,
                poster_image_style: null,
                bodyShowFlag: false,
                vw: null,

                main_header_element: null,
                poster_element: null,
                poster_image_element: null,
                information_element: null,
                artworks_element: null,
                artwork_tracks_container_element: null,
                // more_information_element: null,
                
                header_scale: 1,
                userThumbnail: '',

                interval_return: null
            };
        },
        computed: {
            posterImageElement () {
                /*
                * - posterImage의 사진이 로드되고 나면, MainPage의 각 DOMElement들을 얻어오고 fade-in 효과를 추가한다.
                */
                if (this.poster_image_element) {
                    this.poster_image_element.onload = () => {
                        clearInterval(this.interval_return)

                        this.poster_element = document.getElementsByClassName('poster')[0]
                        this.information_element = document.getElementsByClassName('exhibitionInformation')[0]
                        this.artworks_element = document.getElementsByClassName('exhibitionArtworks')[0]
                        this.artwork_tracks_container_element = document.getElementsByClassName('artworkTracksContainer')[0]
                        // this.more_information_element = document.getElementsByClassName('exhibitionMoreInformation')[0]
                        
                        this.$refs.informationTitle.setInitialPosition()
                        this.$refs.artworksTitle.setInitialPosition()
                        // this.$refs.moreInformationTitle.setInitialPosition()

                        let elementList = [this.poster_element, this.information_element, this.artworks_element]
                        elementList.forEach(function(element) {
                            let children = Array.from(element.children)
                            children.forEach(function(child) {
                                child.classList.add('before-enter')
                            })
                        })
                        this.fadeInEffect()

                        document.getElementById('viewPort').addEventListener('scroll', this.fadeInEffect)
                        this.proper_position_flag = true
                    }
                }
                return this.poster_image_element
            }
        },
        async created() {
            // 유저 썸네일을 빠르게 로드하기 위해 Update history 코드와 분리
            if(isAuth()) {
                // Fetch profile thumbnail and set
                this.user = getAuth()
                this.userThumbnail = this.user.getThumbnail()
            }
            
            this.vw = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", ""))

            this.exhibition = await new Exhibition(this.id).init()
            await this.exhibition.initializePage()
            let images = await this.exhibition.getImages()
            this.poster_image_style = await cropImage(images[0], 1)
            this.poster_image = images[0]
            this.artwork_track_list = this.exhibition.getArtworkList()
            this.category_list = this.exhibition.getCategoryList()
            
            this.poster_image_element = document.getElementById('posterImage')
            

            if (isAuth()) {
                // Update history
                if (this.source === 'qrcode') {
                    const is_history = await this.user.isExhibitionHistory(this.exhibition)
                    if (!is_history) {
                        await this.user.putExhibitionHistory(this.exhibition)
                    }
                    else {
                        await this.user.updateExhibitionHistory(this.exhibition)
                    }
                }
            }
        },
        mounted() {
            // // 모바일 웹에서 주소창을 줄이거나 없애는 코드
            const _this = this

            setTimeout(function() {
                _this.scrollBottom()
                window.addEventListener('scroll', _this.scrollBottom)
            }, 0)
            document.getElementById('viewPort').addEventListener('scroll', this.setHeaderScale)

            this.main_header_element = document.getElementsByClassName('mainHeader')[0]

            let dot_1 = document.getElementsByClassName('phrase')[0].children[0]
            let dot_2 = document.getElementsByClassName('phrase')[0].children[1]
            let dot_3 = document.getElementsByClassName('phrase')[0].children[2]

            dot_1.style.setProperty('opacity', '0')
            dot_2.style.setProperty('opacity', '0')
            dot_3.style.setProperty('opacity', '0')

            setTimeout(() => {
                dot_1.style.setProperty('opacity', '1')
            }, 1000)
            setTimeout(() => {
                dot_2.style.setProperty('opacity', '1')
            }, 2000)
            setTimeout(() => {
                dot_3.style.setProperty('opacity', '1')
            }, 3000)

            this.interval_return = setInterval(() => {
                dot_1.style.setProperty('opacity', '0')
                dot_2.style.setProperty('opacity', '0')
                dot_3.style.setProperty('opacity', '0')

                setTimeout(() => {
                    dot_1.style.setProperty('opacity', '1')
                }, 1000)
                setTimeout(() => {
                    dot_2.style.setProperty('opacity', '1')
                }, 2000)
                setTimeout(() => {
                    dot_3.style.setProperty('opacity', '1')
                }, 3000)
            }, 4000)
        },
        unmounted() {
            window.removeEventListener('scroll', this.scrollBottom)
        },
        methods: {
            scrollBottom () {
                window.scrollTo(0, document.getElementById('mainPage').clientHeight)
            },
            // SideBar component의 openSideBar함수를 실행시켜 sideBar가 열리도록 하는 함수
            openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
            /**
            * - MainPage 스크롤 시 header의 scale값을 계산하는 함수.
            * 1. 스크롤 거리 10vw를 기준으로 header의 Y scale 값을 변경한다.
            * 2. 스크롤 거리 10vw를 기준으로 header의 child elements들의 X scale값을 변경한다.
            */
            setHeaderScale () {
                if (this.main_header_element === null || this.information_element === null || this.poster_element === null || this.artworks_element === null) {
                    console.log('Failed to get dom elements.')
                    return
                }
                
                let header_scale = (document.getElementById('viewPort').scrollTop / this.vw > 10) ? (0.7) : (1 - (document.getElementById('viewPort').scrollTop / (this.vw * 10)) * 0.3)
                this.main_header_element.style.setProperty('transform', `translate(-50%, 0) scaleY(${header_scale})`)

                for (let i = 0; i < this.main_header_element.children.length; i++) {
                    this.main_header_element.children[i].style.setProperty('transform', `scaleX(${header_scale})`)
                }
            },
            fadeInEffect () {
                let elementList = [this.poster_element, this.information_element, this.artworks_element, this.artwork_tracks_container_element]

                const _this = this
                elementList.forEach(function(element) {
                    let children = Array.from(element.children)

                    const __this = _this
                    children.forEach(function(child) {
                        var rect = child.getBoundingClientRect()
                        var in_viewport =  !(rect.right < 0 || rect.left > window.innerWidth || rect.top > (window.innerHeight - 30 * __this.vw))
                        if (__this.checkMobile() === 'ios') {
                            in_viewport =  !(rect.right < 0 || rect.left > window.innerWidth || (window.innerHeight - (rect.height - rect.bottom)) >  (window.innerHeight - 30 * __this.vw))
                        }
                        
                        if (in_viewport) {
                            child.classList.add('enter')
                            child.classList.remove('before-enter')     
                        }
                        else {
                            child.classList.add('after-enter')
                            child.classList.remove('enter')   
                        }
                        if(child.id == 'posterImage') 
                        {
                            child.classList.add('enter')
                            child.classList.remove('before-enter')     
                        }
                    })
                })

            },
            checkMobile () {
                var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
                
                if ( varUA.indexOf('android') > -1) {
                    //안드로이드
                    return "android";
                } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
                    //IOS
                    return "ios";
                } else {
                    //아이폰, 안드로이드 외
                    return "other";
                }
            }

        }
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>