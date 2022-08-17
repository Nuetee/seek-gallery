<template>
    <div id="mainPage">
        <MainHeader :background_color="'white'">
            <template v-slot:default>
                <img src="../assets/seek_logo.png">
            </template>
        </MainHeader>
        <div class="body" v-if="this.exhibition" v-show="this.bodyShowFlag">
            <div class="poster">
                <img id="posterImage" @load="() => {this.bodyShowFlag = true}" :src="this.poster_image"
                    :style="this.poster_image_style">
            </div>
            <div class="exhibitionInformation">
                <TitleHeader></TitleHeader>
                <div class="exhibitionIntroduction">
                    {{ this.exhibition.getInformation() }}
                </div>
            </div>
            <div class="exhibitionArtworks">
                <TitleHeader></TitleHeader>
                <ArtworkTrackList></ArtworkTrackList>
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />
                sad<br />

                sad<br />
                sad<br />
            </div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import TitleHeader from '@/widgets/TitleHeader.vue';
    import ArtworkTrackList from '@/widgets/ArtworkTrackList.vue';

    import { Exhibition } from '@/classes/exhibition';
    import { cropImage } from '@/modules/image';

    export default {
        name: 'MainPage',
        components: {
            MainHeader,
            TitleHeader,
            ArtworkTrackList
        },
        data() {
            return {
                id: this.$route.query.id,
                exhibition: null,
                poster_image: null,
                poster_image_style: null,
                bodyShowFlag: false,
                vw: null,
                poster_element: null,
                information_element: null,
                artworks_element: null,
            };
        },
        beforeCreate() {},
        async created() {
            this.vw = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", ""))

            window.addEventListener('scroll', this.setTopPosition)

            this.exhibition = await new Exhibition(this.id).init()
            let images = await this.exhibition.getImages()
            this.poster_image_style = await cropImage(images[0], 1)
            this.poster_image = images[0]
            
            const poster_image_element = document.getElementById('posterImage')
            poster_image_element.onload = () => {
                this.poster_element = document.getElementsByClassName('poster')[0]
                this.information_element = document.getElementsByClassName('exhibitionInformation')[0]
                this.artworks_element = document.getElementsByClassName('exhibitionArtworks')[0]
                
                this.poster_element.style.setProperty('top', '0')
                this.information_element.style.setProperty('top', `${this.poster_element.clientHeight}px`)
                this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight}px`)
            }
            
           
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {
        },
        beforeUnmount() {},
        unmounted() {},
        methods: {
            setTopPosition () {
                if (window.scrollY < (50 * this.vw)) {
                    this.information_element.style.setProperty('top', `${this.poster_element.clientHeight + window.scrollY}px`)
                    this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight + window.scrollY}px`)
                }
                else {
                    
                }
            },
            topScroll (event) {
                let scrollY = this.top_element.scrollTop
                
                if(scrollY == 195) {
                    
                }
                // up scroll
                // if (scrollY < this.last_top_scroll) {
                //     if (this.last_window_scroll > 0) {

                //         event.preventDefault()
                //     }
                // }
                // else {
                    
                // }
                this.last_top_scroll = scrollY
            },
            scrollEvent () {
                this.last_window_scroll = window.scrollY
                // if (this.exhibition_title.getBoundingClientRect().bottom < window.innerHeight && !this.is_fixed) {
                //     this.exhibition_title.style.setProperty('position', 'fixed')
                //     this.exhibition_title.style.setProperty('bottom', '0')
                //     this.exhibition_title.style.setProperty('left', '0')
                //     this.is_fixed = true
                // }
                // else {
                //     console.log('else')
                //     this.exhibition_title.style.setProperty('position', 'static')
                // }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>