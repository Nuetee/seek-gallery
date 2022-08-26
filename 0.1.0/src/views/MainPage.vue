<template>
    <div id="mainPage">
        <MainHeader :background_color="'white'">
            <template v-slot:left>
                <img src="../assets/seek_logo.png">
            </template>
            <template v-slot:right>
                <RoundProfile :profile="this.userThumbnail" @click="this.openSideBar($event)"></RoundProfile>
            </template>
        </MainHeader>
        <div id="viewPort">
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
                        <div class="exhibitionIntroduction">
                            {{ this.exhibition.getInformation() }}
                        </div>
                    </div>
                    <div class="exhibitionArtworks">
                        <TitleHeader ref="artworksTitle" 
                            :title="'Artworks'" 
                            :startHeight="(this.vw * 30)"
                            :heightUnit="this.vw / 2"
                            :document_element_id="'viewPort'">
                        </TitleHeader>
                        <ArtworkTrackList ref="artworkTrackList" 
                            :artwork_track_list="this.artwork_track_list"
                            :category_list="this.category_list" :proper_position_flag="this.proper_position_flag"
                            :document_element_id="'viewPort'">
                        </ArtworkTrackList>
                    </div>
                </div>
            </transition-group>
        </div>
        <SideBar ref="sideBar"></SideBar>
        <div style="display: none">{{this.posterImageElement}}</div>
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
                
                header_scale: 1,
                userThumbnail: ''
            };
        },
        computed: {
            posterImageElement () {
                /*
                * - posterImage의 사진이 로드되고 나면, MainPage의 각 DOMElement들의 초기 position('top')을 설정한다.
                */
                if (this.poster_image_element) {
                    this.poster_image_element.onload = () => {
                        this.poster_element = document.getElementsByClassName('poster')[0]
                        this.information_element = document.getElementsByClassName('exhibitionInformation')[0]
                        this.artworks_element = document.getElementsByClassName('exhibitionArtworks')[0]
                        this.artwork_tracks_container_element = document.getElementsByClassName('artworkTracksContainer')[0]
                        
                        this.poster_element.style.setProperty('top', '0')
                        this.information_element.style.setProperty('top', `${this.poster_element.clientHeight}px`)
                        this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight}px`)

                        this.$refs.informationTitle.setInitialPosition()
                        this.$refs.artworksTitle.setInitialPosition()

                        let elementList = [this.information_element, this.artworks_element]
                        elementList.forEach(function(element) {
                            let children = Array.from(element.children)
                            children.forEach(function(child) {
                                child.classList.add('before-enter')
                            })
                        })
                        this.fadeInEffect()

                        document.getElementById('viewPort').addEventListener('scroll', this.fadeInEffect)
                    }
                }
                return this.poster_image_element
            }
        },
        beforeCreate() {},
        async created() {
            // 유저 썸네일을 빠르게 로드하기 위해 Update history 코드와 분리
            if(isAuth()) {
                // Fetch profile thumbnail and set
                this.user = getAuth()
                this.userThumbnail = this.user.getThumbnail()
            }
            
            this.vw = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", ""))

            this.exhibition = await new Exhibition(this.id).init()
            let images = await this.exhibition.getImages()
            this.poster_image_style = await cropImage(images[0], 1)
            this.poster_image = images[0]
            this.artwork_track_list = this.exhibition.getArtworkList()
            this.category_list = this.exhibition.getCategoryList()
            
            
            this.poster_image_element = document.getElementById('posterImage')
            

            if (isAuth()) {
                // Update history
                if (this.source === 'qrcode' || true) {
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
                document.getElementById('mainPage').addEventListener('scroll', _this.scrollBottom)
            }, 0)
            document.getElementById('viewPort').addEventListener('scroll', this.setAbsolutePosition)
            document.getElementById('viewPort').addEventListener('scroll', this.getTrackListProperty)

            this.main_header_element = document.getElementsByClassName('mainHeader')[0]
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
            * - MainPage 스크롤 시 MainPage의 각 DOMElement들의 절대 위치를 재설정하는 함수.
            * : 각 DOMElement들의 position 속성은 'absolute' 이므로 top 속성을 변경하여 절대 위치를 재설정한다.
            * : 절대 위치를 재설정하는 이유는 Poster와 전시제목이 동시에 움직이지 않고 일정 거리를 벌리는 작업이 필요하기 때문.
            * 1. 스크롤 거리 10vw를 기준으로 header의 Y scale 값을 구한다.
            * 2. 스크롤한 거리가 50vw 이하일 때, 각 DOMElement들의 top 속성을 변경한다.
            */
            setAbsolutePosition () {
                if (this.main_header_element === null || this.information_element === null || this.poster_element === null || this.artworks_element === null) {
                    console.log('Failed to get dom elements.')
                    return
                }
                
                let header_scale = (document.getElementById('viewPort').scrollTop / this.vw > 10) ? (0.7) : (1 - (document.getElementById('viewPort').scrollTop / (this.vw * 10)) * 0.3)
                this.main_header_element.style.setProperty('transform', `translate(-50%, 0) scaleY(${header_scale})`)

                for (let i = 0; i < this.main_header_element.children.length; i++) {
                    this.main_header_element.children[i].style.setProperty('transform', `scaleX(${header_scale})`)
                }

                if (document.getElementById('viewPort').scrollTop < (50 * this.vw)) {
                    this.information_element.style.setProperty('top', `${this.poster_element.clientHeight + document.getElementById('viewPort').scrollTop}px`)
                    this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight + document.getElementById('viewPort').scrollTop}px`)
                }
            },
            /**
            * - poster이미지와 전시정보 사이 거리가 최대로 벌어졌을 때, this.proper_position_flag = true로 설정하여 ArtworkTrackList가 현재 자신의 위치(최상단으로부터의 거리)를 정확히 구할 수 있도록 하는 함수
            : 정확한 거리를 구할 수 있을 때 한번만 실행되면 되므로 함수 실행으로 인한 부하를 줄이기 위해 첫 실행 후 eventListener를 제거한다.
            */
            getTrackListProperty () {
                if (document.getElementById('viewPort').scrollTop >= (50 * this.vw)) {
                    this.proper_position_flag = true
                    document.getElementById('viewPort').removeEventListener('scroll', this.getTrackListProperty)
                }
            },
            fadeInEffect () {
                let elementList = [this.information_element, this.artworks_element, this.artwork_tracks_container_element]

                const _this = this
                elementList.forEach(function(element) {
                    let children = Array.from(element.children)

                    const __this = _this
                    children.forEach(function(child) {
                        var rect = child.getBoundingClientRect()
                        var in_viewport =  !(rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > (window.innerHeight - 30 * __this.vw))
                        
                        if (in_viewport) {
                            child.classList.add('enter')
                            child.classList.remove('before-enter')     
                        }
                        else {
                            child.classList.add('after-enter')
                            child.classList.remove('enter')   
                        }
                    })
                })

            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>