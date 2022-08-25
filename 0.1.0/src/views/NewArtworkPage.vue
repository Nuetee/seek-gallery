<template>
    <div id="newArtworkPage">
        <MainHeader :background_color="'transparent'">
            <template v-slot:left>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" @click="this.back($event)">
                    <path d="M7 13L1 7L7 1" :stroke="(this.artwork ? this.artwork.getColor() : 'black')" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </template>
            <template v-slot:right>
                <RoundProfile :profile="this.profile" @click="this.openSideBar($event)"></RoundProfile>
            </template>
        </MainHeader>
        <swiper class="artworkSlider" v-bind="this.swiper_options" @slideChange="this.setCurrentArtwork">
            <swiper-slide v-for="(artwork, i) in this.artwork_list" :key="i">
                <ArtworkImageSlider :artwork_image_information_list="(artwork !== undefined ? artwork.image_information : null)"></ArtworkImageSlider>
            </swiper-slide>
        </swiper>
        <div class="buttonContainer">
            <CommentButton ref="commentButton" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')" @click="this.showComment($event)"></CommentButton>
            <ArchiveButton ref="archiveButton" :artwork="this.current_artwork" :color="(this.current_artwork ? this.current_artwork.getColor() : 'black')">
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

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import { Artwork } from '@/classes/artwork';
    import { isAuth, getAuth } from '@/modules/auth'
    import { cropImage } from '@/modules/image';

    export default {
        name: 'NewArtworkPage',
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
            CommentComponent,
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
                    initialSlide: this.$route.query.index,
                    loop: false,
                    centeredSlides: true,
                    resistanceRatio: 0,
                }
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
        mounted() {},
        beforeUpdate() {},
        updated() {},
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
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/NewArtworkPage/newArtworkPage.scss"></style>