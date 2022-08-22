<template>
    <div id="artworkPage" v-if="this.artwork">
        <div class="body" :style="'color: ' + this.artwork.getColor()">
            <MainHeader :background_color="'transparent'">
                <template v-slot:left>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" @click="this.back()">
                        <path d="M7 13L1 7L7 1" :stroke="this.artwork.getColor()" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </template>
                <template v-slot:right>
                    <RoundProfile :profile="this.profile" @click="this.openSideBar($event)"></RoundProfile>
                </template>
            </MainHeader>
            <div class="artworkInformation">
                <div class="top">
                    <div class="artworkTitle poppins">{{ this.artwork.getName() }}</div>
                    <ArchiveInfo :archive_count="this.artwork.getArchiveCount()" :color="this.artwork.getColor()"></ArchiveInfo>
                </div>
                <div class="bottom">
                    <div class="artist">{{ this.artwork.getArtist().nickname }}</div>
                    <SNSLink :sns_link="this.artwork.getArtist().getSNS()"></SNSLink>
                </div>
            </div>
            <ArtworkImageSlider :artwork_image_information_list="this.artwork_image_information_list"></ArtworkImageSlider>
            <div class="buttonContainer">
                <CommentButton ref="commentButton" :color="this.artwork.getColor()" @click="this.showComment()"></CommentButton>
                <ArchiveButton ref="archiveButton" :artwork="this.artwork" :color="this.artwork.getColor()">
                </ArchiveButton>
                <ShareButton ref="shareButton" :color="this.artwork.getColor()" :artwork="this.artwork">
                </ShareButton>
            </div>
            <Drawer ref="commentDrawer" :class="'comment'">
                <template v-slot:default>
                    <CommentComponent ref="commentComponent" @commentUpdate="this.updateDone" :artwork="this.artwork">
                    </CommentComponent>
                </template>
            </Drawer>
            <SideBar ref="sideBar"></SideBar>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import ArchiveInfo from '@/widgets/ArchiveInfo.vue';
    import SNSLink from '@/widgets/SNSLink.vue';
    import SideBar from '@/widgets/SideBar.vue';
    import RoundProfile from '@/widgets/RoundProfile.vue';
    import ArtworkImageSlider from '@/components/ArtworkPage/ArtworkImageSlider.vue'
    import CommentButton from '@/components/ArtworkPage/CommentButton.vue'
    import ArchiveButton from '@/components/ArtworkPage/ArchiveButton.vue'
    import ShareButton from '@/widgets/ShareButton.vue';
    import CommentComponent from '@/components/ArtworkPage/CommentComponent.vue'

    import { Artwork } from '@/classes/artwork';
    import { cropImage } from '@/modules/image';
    import { isAuth, getAuth } from '@/modules/auth';
    import Drawer from '@/widgets/Drawer.vue';

    export default {
        name: 'ArtworkPage',
        components: {
            MainHeader,
            ArchiveInfo,
            SNSLink,
            SideBar,
            RoundProfile,
            ArtworkImageSlider,
            CommentButton,
            ArchiveButton,
            ShareButton,
            Drawer,
            CommentComponent
        },
        data() {
            return {
                id: this.$route.query.id,
                artwork: null,
                artwork_image_information_list: [],
                profile: '',
                update_in_progress: false
            };
        },
        async created() {
            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }

            this.artwork = await new Artwork(this.id).init()

            // 모바일 웹에서 주소창을 줄이거나 없애는 코드
            const _this = this
            setTimeout(function() {
                _this.scrollBottom()
                window.addEventListener('scroll', _this.scrollBottom)
            }, 0)

            await this.getArtworkImages()

            if (this.artwork.getColor() === 'black') {
                document.getElementsByClassName('artworkImageSlider')[0].style.setProperty('--color', 'black')
            }
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
        unmounted() {
            window.removeEventListener('scroll', this.scrollBottom)
        },
        methods: {
            back () {
                window.history.back()
            },
            scrollBottom () {
                window.scrollTo(0, document.body.scrollHeight)
            },
            // SideBar component의 openSideBar함수를 실행시켜 sideBar가 열리도록 하는 함수
            openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
            async getArtworkImages () {
                let artwork_images = await this.artwork.getAllImages()

                let container_ratio = window.innerWidth / window.innerHeight

                if (window.innerWidth >= 480) {
                    container_ratio = 480 / window.innerHeight
                }

                for (let i = 0; i < artwork_images.length; i++) {
                    let style = await cropImage(artwork_images[i], container_ratio)

                    let image_information = new Object()
                    image_information.src = artwork_images[i]
                    image_information.style = style

                    this.artwork_image_information_list.push(image_information)
                }
            },
            showComment () {
                this.$refs.commentDrawer.showDrawer()
            },
            updateDone () {
                this.update_in_progress = false
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/ArtworkPage/artworkPage.scss"></style>