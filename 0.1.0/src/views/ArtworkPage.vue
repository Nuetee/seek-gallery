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
                <RoundProfile :profile="this.profile" @click="this.openSideBar($event)"></RoundProfile>
            </template>
        </MainHeader>
        <div class="artworkInformation" :style="'color: ' + (this.current_artwork ? this.current_artwork.getColor() : 'black')">
            <div class="top">
                <div class="artworkTitle poppins">{{ this.current_artwork ? this.current_artwork.getName() : '' }}</div>
                <ArchiveInfo :archive_count="this.current_artwork ? this.current_artwork.getArchiveCount() : 0" :color="this.current_artwork ? this.current_artwork.getColor() : 'black'"></ArchiveInfo>
            </div>
            <div class="bottom">
                <div class="artist">{{ this.current_artwork ? this.current_artwork.getArtistName() : '' }}</div>
                <SNSLink :sns_link="this.current_artwork ? this.current_artwork.getArtist().getSNS() : ''"></SNSLink>
            </div>
        </div>
        <swiper class="artworkSlider" v-bind="this.swiper_options" @slideChange="this.setCurrentArtwork">
            <swiper-slide v-for="(artwork, i) in this.artwork_list" :key="i">
                <ArtworkImageSlider :artwork_image_information_list="(artwork ? artwork.image_information : null)"></ArtworkImageSlider>
            </swiper-slide>
        </swiper>
        <div class="buttonContainer">
            <CommentButton ref="commentButton" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')" @click="this.showComment($event)"></CommentButton>
            <ArchiveButton ref="archiveButton" :artwork="this.current_artwork">
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
                    initialSlide: parseInt(this.$route.query.index),
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                },
                update_in_progress: false,
                abortController: null,
                first_load: true
            };
        },
        async created() {
            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }
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
                        //console.log(error)
                    })
                    this.pushArtworkInList(this.current_index + range, this.abortController.signal)
                    .catch((error) => {
                        //console.log(error)
                    })
                }
            })
            .catch((error) => {
                //console.log(error)
            })
            
        },
        mounted() {
            const _this = this
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
        methods: {
            back (event) {
                // event 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응
                window.history.back()
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
                        
                        artwork.image_information = image_information_list

                        this.artwork_list[index] = artwork
                    }
                    resolve(true)
                })
                
            },
            async setCurrentArtwork (swiper) {
                console.log('current: ' + this.current_index + ' active: ' + swiper.activeIndex)
                if (this.first_load) {
                    this.first_load = false
                    return
                }
                this.abortController.abort()
                this.abortController = null
                this.abortController = new AbortController()
                this.current_index = swiper.activeIndex
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