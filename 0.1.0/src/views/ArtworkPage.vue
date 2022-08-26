<template>
    <div id="artworkPage">
        <MainHeader :background_color="'transparent'">
            <template v-slot:left>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" @click="this.back($event)">
                    <path d="M7 13L1 7L7 1" :stroke="(this.current_artwork ? this.current_artwork.getColor() : 'black')" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
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
                <div class="artist">{{ this.current_artwork ? this.current_artwork.getArtist().nickname : '' }}</div>
                <SNSLink :sns_link="this.current_artwork ? this.current_artwork.getArtist().getSNS() : ''"></SNSLink>
            </div>
        </div>
        <swiper class="artworkSlider" v-bind="this.swiper_options" @slideChange="this.setCurrentArtwork">
            <swiper-slide v-for="(artwork, i) in this.artwork_list" :key="i">
                <ArtworkImageSlider :artwork_image_information_list="(artwork !== undefined ? artwork.image_information : null)"></ArtworkImageSlider>
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
                current_artwork: null,
                profile: '',
                initial_index: parseInt(this.$route.query.index),
                swiper_options: {
                    direction: 'vertical',
                    slidesPerView: 1,
                    spaceBetween: 0,
                    initialSlide: parseInt(this.$route.query.index),
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                },
                update_in_progress: false
            };
        },
        async created() {
            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }
            
            this.artwork_list = new Array(this.artwork_id_list.length)
            
            let initial_load = await this.setArtworkList(this.initial_index)
            if (initial_load)
                this.current_artwork = this.artwork_list[this.initial_index]
            else
                console.log('load failure')

            let load_range = 1
            
            while (true) {
                let next = await this.setArtworkList(this.initial_index + load_range)
                let prev = await this.setArtworkList(this.initial_index - load_range)
                load_range += 1

                if (!next && !prev) {
                    break
                }
            }
        },
        beforeMount() {},
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
        beforeUpdate() {},
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
        beforeUnmount() {},
        unmounted() {},
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
            async setArtworkList (index) {
                if (index >= this.artwork_id_list.length || index < 0) {
                    return false
                }

                if (this.artwork_list[index] === undefined) {
                    let artwork = await new Artwork(this.artwork_id_list[index]).init()
                    let artwork_images = await artwork.getAllImages()
                    let container_ratio = window.innerWidth / window.innerHeight

                    if (window.innerWidth >= 480) {
                        container_ratio = 480 / window.innerHeight
                    }

                    let image_information_list = new Array(0)

                    for (let i = 0; i < artwork_images.length; i++) {
                        let style = await cropImage(artwork_images[i], container_ratio)

                        let image_information = new Object()
                        image_information.src = artwork_images[i]
                        image_information.style = style

                        image_information_list.push(image_information)
                    }
                    
                    artwork.image_information = image_information_list

                    this.artwork_list[index] = artwork
                }
                
                return true
            },
            async setCurrentArtwork (swiper) {
                this.update_in_progress = false
                let artwork = this.artwork_list[swiper.activeIndex]

                if (artwork === undefined) {
                    if (await this.setArtworkList(swiper.activeIndex)) {
                        artwork = this.artwork_list[swiper.activeIndex]
                    }
                    else {
                        console.log('artwork load error')
                    }
                }

                this.current_artwork = artwork
            },
            updateDone () {
                this.update_in_progress = false
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/ArtworkPage/artworkPage.scss"></style>