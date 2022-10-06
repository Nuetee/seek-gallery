<template>
    <div id="artworkPage">
        <MainHeader :background_color="'transparent'">
            <template v-slot:left>
                <div class="backButton" @click="this.back($event)">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 13L1 7L7 1" :stroke="(this.current_artwork ? this.current_artwork.getColor() : 'black')" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </template>
            <template v-slot:right>
                <RoundProfile :profile="this.profile" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')" @click="this.openSideBar($event)"></RoundProfile>
            </template>
        </MainHeader>
        <div class="artworkInformation" :style="'color: ' + (this.current_artwork ? this.current_artwork.getColor() : 'black')">
            <div class="top">
                <div class="artworkTitle poppins">{{ this.current_artwork ? this.current_artwork.getName() : '' }}</div>
                <ArchiveInfo :archive_count="this.current_artwork ? this.current_artwork.getArchiveCount() : 0" :color="this.current_artwork ? this.current_artwork.getColor() : 'black'"></ArchiveInfo>
            </div>
            <div class="bottom">
                <div class="artist">{{ this.current_artwork ? this.current_artwork.getArtistName() : '' }}</div>
                <SNSLink 
                    :artwork_id="this.current_artwork ? this.current_artwork.getArtist().getID().toString() : ''"
                    :sns_link="this.current_artwork ? this.current_artwork.getArtist().getSNS() : ''"></SNSLink>
            </div>
        </div>
        <swiper class="artworkSlider" v-bind="this.swiper_options" @slideChange="this.setCurrentArtwork">
            <swiper-slide v-for="(artwork, i) in this.artwork_list" :key="i">
                <ArtworkImageSlider :artwork_image_information_list="(artwork ? artwork.image_information : null)"></ArtworkImageSlider>
            </swiper-slide>
        </swiper>
        <div class="buttonContainer">
            <CommentButton ref="commentButton" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')" @click="this.showComment($event)"></CommentButton>
            <ArchiveButton ref="archiveButton" 
                :artwork="this.current_artwork"
                @set-archive-popup="this.setArchivePopUp">
            </ArchiveButton>
            <ShareButton ref="shareButton" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')" :artwork="this.current_artwork">
            </ShareButton>
        </div>
        <Drawer ref="commentDrawer" :class="'comment'">
            <template v-slot:default>
                <CommentComponent ref="commentComponent" @commentUpdate="this.updateDone" :artwork="this.current_artwork">
                </CommentComponent>
            </template>
        </Drawer>
        <Drawer ref="informationDrawer" :class="'information'">
            <template v-slot:default>
                <ArtworkInformation :artwork="this.current_artwork"></ArtworkInformation>
            </template>
        </Drawer>
        <SideBar ref="sideBar"></SideBar>
        <div class="popUp archive" ref="archivePopUp">
            <svg width="48" height="37" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_404_573)">
                    <path
                        d="M2.44952 15.396C2.05636 14.9172 1.34866 14.847 0.86882 15.2394C0.388984 15.6317 0.31872 16.3379 0.711881 16.8167L16.4695 36.0067C16.8627 36.4855 17.5704 36.5556 18.0502 36.1633C18.53 35.771 18.6003 35.0648 18.2071 34.586L2.44952 15.396Z"
                        fill="black" />
                    <path
                        d="M47.1869 2.30891C47.5902 1.83857 47.535 1.13106 47.0637 0.728643C46.5923 0.326225 45.8833 0.381286 45.48 0.851625L16.5336 34.6107C16.1303 35.0811 16.1855 35.7886 16.6568 36.191C17.1282 36.5934 17.8372 36.5384 18.2405 36.068L47.1869 2.30891Z"
                        fill="black" />
                </g>
                <defs>
                    <clipPath id="clip0_404_573">
                        <rect width="47.9171" height="36.9196" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <p>아카이빙 완료!</p>
        </div>
        <div class="scrollPopUpContainer"
            v-if="this.is_first_access && this.current_artwork"
            @click="this.scrollPopUpClick($event)"
            >
            <div class="popUp">
                <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 30.875V8.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.125 19.5L19.5 8.125L30.875 19.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 8.125V30.875" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30.875 19.5L19.5 30.875L8.125 19.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>스크롤해서<br>다음 작품으로!</p>
            </div>
        </div>
        <div class="tap poppins"
            v-if="this.is_first_access && this.current_artwork"
            @click="this.tapClick()"
            :style="'color: ' + (this.current_artwork ? this.current_artwork.getColor() : 'black')">
            Tap!
        </div>
        <div class="loading" v-if="!this.current_artwork" @click="this.stopPropagation($event)">
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
                로딩 중<span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import SideBar from '@/widgets/SideBar.vue';
    import RoundProfile from '@/widgets/RoundProfile.vue';
    import ArtworkImageSlider from '@/components/ArtworkPage/ArtworkImageSlider.vue';
    import CommentButton from '@/components/ArtworkPage/CommentButton.vue'
    import ArchiveButton from '@/components/ArtworkPage/ArchiveButton.vue'
    import ShareButton from '@/widgets/ShareButton.vue';
    import CommentComponent from '@/components/ArtworkPage/CommentComponent.vue'
    import Drawer from '@/widgets/Drawer.vue';
    import ArtworkInformation from '@/components/ArtworkPage/ArtworkInformation.vue';
    import ArchiveInfo from '@/widgets/ArchiveInfo.vue';
    import SNSLink from '@/widgets/SNSLink.vue';

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import { Artwork } from '@/classes/artwork';
    import { isAuth, getAuth } from '@/modules/auth'
    import { cropImage } from '@/modules/image';
    import { useCookies } from 'vue3-cookies'
    import { getRandomArtworks } from '@/modules/public';

    export default {
        name: 'ArtworkPage',
        components: {
            MainHeader,
            SideBar,
            RoundProfile,
            Swiper,
            SwiperSlide,
            ArtworkImageSlider,
            CommentButton,
            ArchiveButton,
            ShareButton,
            Drawer,
            ArtworkInformation,
            CommentComponent,
            ArchiveInfo,
            SNSLink
        },
        data() {
            return {
                artwork_id_list: this.$route.query.array,
                artwork_list: null,
                initialize_artwork_list: false,
                current_artwork: null,
                profile: '',
                current_index: parseInt(this.$route.query.index),
                swiper_options: {
                    direction: 'vertical',
                    slidesPerView: 1,
                    spaceBetween: 0,
                    initialSlide: parseInt(this.$route.query.index ? this.$route.query.index : 0),
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                },
                update_in_progress: false,
                abortController: null,
                first_load: true,
                is_first_access: true,
                timeout_flag: false,

                // 간이 홈 data
                seed: null,
                offset: 0,
                limit: 10,
                update_in_progress: false
            };
        },
        async created() {
            if (this.artwork_id_list === undefined) {
                // 0 ~ 999 까지의 난수 생성
                this.seed = Math.floor(Math.random() * 1000)
                this.artwork_id_list = await getRandomArtworks(this.seed, this.offset, this.limit)
                this.offset += this.limit
                this.current_index = 0
                this.swiper_options.initialSlide = 0
            }
            else if (typeof(this.artwork_id_list) === 'string') {
                this.artwork_id_list = new Array(0)
                this.artwork_id_list.push(this.$route.query.array)
                this.current_index = 0
                this.swiper_options.initialSlide = 0
            }

            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }

            const cookies = useCookies().cookies
            if(cookies.isKey("isFirstAccess")) {
                this.is_first_access = false
            }
            else {
                this.is_first_access = true
                console.log("first access")
            }
            let expireDate = new Date()
            // 현재부터 7일 후까지 cookies 유지
            expireDate.setDate(expireDate.getDate() + 7)
            cookies.set("isFirstAccess", false, expireDate)

            this.abortController = new AbortController()
            this.artwork_list = new Array(this.artwork_id_list.length)
            this.pushArtworkInList(this.current_index, this.abortController.signal).then((value) => {
                let initial_load = value
                if (initial_load)
                    this.current_artwork = this.artwork_list[this.current_index]
                else
                    console.log('load failure')

                this.first_load = false

                for (let range = 1; range <= 3; range++) {
                    this.pushArtworkInList(this.current_index - range, this.abortController.signal)
                    .catch((error) => {
                        // console.log(error)
                    })
                    this.pushArtworkInList(this.current_index + range, this.abortController.signal)
                    .catch((error) => {
                        // console.log(error)
                    })
                }
            })
            .catch((error) => {
                // console.log(error)
            })
        },
        mounted() {
            const _this = this  
            // 스크롤로 새로고침 막기
            document.body.style.position = 'fixed';
            document.body.style.overflow = 'hidden'
            
            // - Drawer들 (Comment, Information)이 click event에 의해 여닫아 지는 것을 control하는 code.
            document.getElementById('artworkPage').addEventListener('click', function () {
                if (_this.$refs.informationDrawer.drawer_opened) {
                    _this.$refs.informationDrawer.closeDrawer()
                    _this.$refs.commentDrawer.closeDrawer()
                }
                else if (!_this.$refs.commentDrawer.drawer_opened) {
                    _this.$refs.informationDrawer.showDrawer()
                }
                else {
                    _this.$refs.commentDrawer.closeDrawer()
                }
            })
        },
        updated () {
            const _this = this
            // Scroll Listener
            document.getElementsByClassName('drawer comment')[0].addEventListener('scroll', async function (event) {
                if (_this.update_in_progress) {
                    return false
                }

                let scroll_height = event.target.scrollHeight
                let scroll_top = parseInt(event.target.scrollTop) + 1
                let offset_height = parseInt(event.target.offsetHeight) + 1

                if (scroll_height <= scroll_top + offset_height) {
                    _this.update_in_progress = true
                    await _this.$refs.commentComponent.load()
                }
            })
        },
        beforeMount () {
            document.body.style.overscrollBehaviorY = 'auto';
        },
        methods: {
            setArchivePopUp (is_archive) {
                if (is_archive) {
                    this.$refs.archivePopUp.classList.add('show')

                    const _this = this
                    this.timeout_flag = setTimeout(function() {
                        _this.$refs.archivePopUp.classList.remove('show')
                    }, 1000)
                }
                else {
                    clearTimeout(this.timeout_flag)
                    this.$refs.archivePopUp.classList.remove('show')
                }
            },
            scrollPopUpClick (event) {
                document.getElementsByClassName('scrollPopUpContainer')[0].style.setProperty('display', 'none')
                this.stopPropagation(event)
            },
            tapClick () {
                this.is_first_access = false
                document.getElementById('artworkPage').click()
            },
            back (event) {
                this.stopPropagation(event)
                window.history.back()
            },
            stopPropagation (event) {
                // event 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응
            },
            openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
            showComment (event) {
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응

                this.$refs.commentDrawer.showDrawer()
            },
            pushArtworkInList (index, abortSignal) {
                return new Promise(async (resolve, reject) => {
                    abortSignal.addEventListener('abort', () => {
                        const error = new DOMException( 'Calculation aborted by the user', 'AbortError' );
                        
                        return reject( error );
                    })

                    if (index >= this.artwork_id_list.length || index < 0) {
                        return resolve(false)
                    }

                    if (this.artwork_list[index] === undefined || this.artwork_list[index] === null) {
                        let artwork = await new Artwork(this.artwork_id_list[index]).init()
                        await artwork.initializePage()

                        let artwork_images = await artwork.getAllImages()
                        let container_ratio = window.innerWidth / window.innerHeight

                        if (window.innerWidth >= 480) {
                            container_ratio = 480 / window.innerHeight
                        }

                        let image_information_list = new Array(0)

                        const promises = artwork_images.map(async (image) => {
                            return await cropImage(image, container_ratio)
                        })

                        const styles = await Promise.all(promises)

                        for (let i = 0; i < artwork_images.length; i++) {
                            let image_information = new Object()
                            image_information.src = artwork_images[i]
                            image_information.style = styles[i]

                            image_information_list.push(image_information)
                        }
                        
                        // artwork에 video가 존재하는 경우
                        if (artwork.isVideo() !== null) {
                            let video_index = artwork.isVideo()
                            let video = new Object()
                            // video를 받아오는데 성공하면 image_information_list에 video 삽입
                            video.src = await artwork.getVideo()
                            
                            if (video.src !== null) {
                                video.style = 'video'
                                if (image_information_list.length !== 0) {
                                    video.background_src = await artwork.getThumbnailImage()
                                    video.background_style = await cropImage(video.background_src, container_ratio)
                                }
                                else {
                                    video.background_src = ''
                                    video.background_style = ''
                                }

                                image_information_list.splice(video_index, 0, video)
                            }
                        }

                        artwork.image_information = image_information_list

                        this.artwork_list[index] = artwork
                    }
                    resolve(true)
                })
                
            },
            /**
             * 
             * @param {Object} swiper - swiper DOM 객체
             * 작품페이지에서 swiperChange가 발생하면 호출된다.
             * 1. 만약 first_load가 true이면 first_load를 false로 바꾸고 return
             * 2. abortController.abort()를 통해 현재 진행 중인 모든 작품 load 작업을 중단한다.
             * 3. 만약 중단하지 않으면 중복된 작품 로드가 무수히 많이 발생할 수 있으며 이는 성능 하락과 버그를 발생시킬 수 있다.
             * 4. 새로운 abortController 객체를 생성한다.
             * 5. 현재 바뀐 swiper slide에 맞는 artwork를 로드하기 전까지 current_artwork = null로 설정한다.
             * 6. current_index를 바뀐 swiper index와 동기화 한다.
             * 7. 작품 archive시 등장하는 archivePopUp DOM 객체의 class를 초기화한다.
             * 8. 만약 현재 swiper slide에 맞는 작품객체가 이미 로드돼어 artwork_list 배열에 저장돼있으면 해당 배열에서 current_artwork를 가져온다.
             * 9. artwork_list 배열에 현재 swiper slide에 맞는 작품 객체가 없으면 pushArtworkInList 함수를 호출하여 현재 artwork_list 요소 중 slide index에 해당하는 부분을 로드하고, 로드가 완료되면 해당 요소를 current_artwork로 설정한다.
             * 10. 현재 작품 index를 기준으로 +-3에 해당하는 artwork_list 요소들을 pushArtworkInList함수를 통해 로드한다.
             */
            async setCurrentArtwork (swiper) {
                if (this.first_load) {
                    this.first_load = false
                    return
                }
                this.abortController.abort()
                this.abortController = null
                this.abortController = new AbortController()

                this.current_artwork = null
                this.current_index = swiper.activeIndex
                this.$refs.archivePopUp.classList.remove('show')
                clearTimeout(this.timeout_flag)

                // 간이 홈화면
                if (this.seed !== null) {
                    // 끝에서 3번째에 해당하는 slide에 왔을 경우 이후 artwork page id 배열을 로드하여 기존 artwork_id_list와 합친다.
                    if (this.offset - 3 === swiper.activeIndex && this.update_in_progress === false) {
                        // this.update_in_progress를 통해 중복 업데이트가 발생하지 않도록 한다.
                        this.update_in_progress = true
                        
                        let next_artwork_id_list = await getRandomArtworks(this.seed, this.offset, this.limit)
                        let new_artwork_id_list = [
                            ...this.artwork_id_list,
                            ...next_artwork_id_list
                        ]
                        this.offset += this.limit
                        this.artwork_id_list = new_artwork_id_list
                        
                        this.update_in_progress = false
                    }
                }

                if (this.artwork_list[swiper.activeIndex]) {
                    this.current_artwork = this.artwork_list[swiper.activeIndex]
                }
                else {
                    this.pushArtworkInList(swiper.activeIndex, this.abortController.signal).then((value) => {
                        this.current_artwork = this.artwork_list[swiper.activeIndex]
                    })
                    .catch((error) => {
                        //console.log(error)
                    })
                }
                let range = 1;
                while (range <= 3) {
                    let next = this.current_index + range <= this.artwork_list.length
                    let prev = this.current_index + range <= this.artwork_list.length
                    if (next) {
                        this.pushArtworkInList(this.current_index + range, this.abortController.signal)
                        .catch((error) => {
                            //console.log(error)
                        })
                    }
                    if (prev) {
                        this.pushArtworkInList(this.current_index - range, this.abortController.signal)
                        .catch((error) => {
                            //console.log(error)
                        })
                    }
                    
                    range++
                }
                
                // 범위 밖의 artwork 들은 null로 처리해준다. => RAM 과부하 줄이기 위함
                for (let i = 0; i < this.current_index - 3; i++) {
                    this.artwork_list[i] = null
                }
                for (let i = this.current_index + 4; i < this.artwork_list.length; i++) {
                    this.artwork_list[i] = null
                }
            },
            updateDone () {
                this.update_in_progress = false
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/ArtworkPage/artworkPage.scss"></style>