<template>
    <div id="mainPage">
        <MainHeader :background_color="'white'">
            <template v-slot:default>
                <img src="../assets/seek_logo.png">
            </template>
        </MainHeader>
        <div class="body">
            <div class="top">
                <div class="poster">
                    <img class="posterImage" @load="this.setTopHeight()" src="../assets/ee8eabd8df23a4f9b29100d59217586e.jpeg">
                </div>
                <div class="exhibitionTitle">
                    <TitleHeader></TitleHeader>
                </div>
            </div>
            <div class="bottom">
                <div class="exhibitionIntroduction">

                </div>
                <div class="exhibitionArtworks">
                    <TitleHeader></TitleHeader>
                    <ArtworkTrackList></ArtworkTrackList>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import TitleHeader from '@/widgets/TitleHeader.vue';
    import ArtworkTrackList from '@/widgets/ArtworkTrackList.vue';

    export default {
        name: 'MainPage',
        components: {
            MainHeader,
            TitleHeader,
            ArtworkTrackList
        },
        data() {
            return {
                exhibition_title: null,
                top_position: null,
                is_fixed: false
            };
        },
        beforeCreate() {},
        created() {
            window.addEventListener('scroll', this.scrollEvent)
        },
        beforeMount() {},
        mounted() {
            this.exhibition_title = document.getElementsByClassName('exhibitionTitle')[0]
        },
        beforeUpdate() {},
        updated() {
        },
        beforeUnmount() {},
        unmounted() {},
        methods: {
            setTopHeight () {
                let poster_image = document.getElementsByClassName('posterImage')[0]
                let top = document.getElementsByClassName('top')[0]

                let padding_bottom = window.innerWidth * 0.5
                if (window.innerWidth >= 480) {
                    padding_bottom = 480 * 0.5
                }

                top.style.setProperty('height', `${poster_image.clientHeight + padding_bottom}px`)
                this.top_position = top.getBoundingClientRect().bottom
            },
            scrollEvent () {
                if (this.exhibition_title.getBoundingClientRect().bottom < window.innerHeight && !this.is_fixed) {
                    this.exhibition_title.style.setProperty('position', 'fixed')
                    this.exhibition_title.style.setProperty('bottom', '0')
                    this.exhibition_title.style.setProperty('left', '0')
                    this.is_fixed = true
                }
                // else {
                //     console.log('else')
                //     this.exhibition_title.style.setProperty('position', 'static')
                // }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>