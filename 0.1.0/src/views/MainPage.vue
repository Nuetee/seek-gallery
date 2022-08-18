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
                <TitleHeader ref="informationTitle" :title="'전시제목'" :startHeight="(this.vw * 30)"
                    :heightUnit="this.vw / 2">
                </TitleHeader>
                <div class="exhibitionIntroduction">
                    {{ this.exhibition.getInformation() }}
                </div>
            </div>
            <div class="exhibitionArtworks">
                <TitleHeader ref="artworksTitle" :title="'Artworks'" :startHeight="(this.vw * 30)"
                    :heightUnit="this.vw / 2">
                </TitleHeader>
                <ArtworkTrackList :artwork_track_list="this.artwork_track_list" :category_list="this.category_list">
                </ArtworkTrackList>
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
                artwork_track_list: [],
                category_list: [],

                poster_image: null,
                poster_image_style: null,
                bodyShowFlag: false,
                vw: null,

                main_header_element: null,
                poster_element: null,
                information_element: null,
                artworks_element: null,
                
                header_scale: 1,
            };
        },
        beforeCreate() {},
        async created() {
            this.vw = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", ""))

            window.addEventListener('scroll', this.setAbsolutePosition)

            this.exhibition = await new Exhibition(this.id).init()
            let images = await this.exhibition.getImages()
            this.poster_image_style = await cropImage(images[0], 1)
            this.poster_image = images[0]
            this.artwork_track_list = this.exhibition.getArtworkList()
            this.category_list = this.exhibition.getCategoryList()
            
            /*
            * - posterImage의 사진이 로드되고 나면, MainPage의 각 DOMElement들의 초기 position('top')을 설정한다.
            */
            const poster_image_element = document.getElementById('posterImage')
            poster_image_element.onload = () => {
                this.poster_element = document.getElementsByClassName('poster')[0]
                this.information_element = document.getElementsByClassName('exhibitionInformation')[0]
                this.artworks_element = document.getElementsByClassName('exhibitionArtworks')[0]
                
                this.poster_element.style.setProperty('top', '0')
                this.information_element.style.setProperty('top', `${this.poster_element.clientHeight}px`)
                this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight}px`)

                this.$refs.informationTitle.setInitialPosition()
                this.$refs.artworksTitle.setInitialPosition()
            }
        },
        beforeMount() {},
        mounted() {
            this.main_header_element = document.getElementsByClassName('mainHeader')[0]
        },
        beforeUpdate() {},
        updated() {
        },
        beforeUnmount() {},
        unmounted() {},
        methods: {
            /*
            * - MainPage 스크롤 시 MainPage의 각 DOMElement들의 절대 위치를 재설정하는 함수.
            * : 각 DOMElement들의 position 속성은 'absolute' 이므로 top 속성을 변경하여 절대 위치를 재설정한다.
            * : 절대 위치를 재설정하는 이유는 Poster와 전시제목이 동시에 움직이지 않고 일정 거리를 벌리는 작업이 필요하기 때문.
            * 1. 스크롤 거리 10vw를 기준으로 header의 Y scale 값을 구한다.
            * 2. 스크롤한 거리가 50vw 이하일 때, 각 DOMElement들의 top 속성을 변경한다.
            */
            setAbsolutePosition () {
                let header_scale = (window.scrollY/this.vw > 10) ? (0.7) : (1 - (window.scrollY/(this.vw * 10)) * 0.3)
                this.main_header_element.style.setProperty('transform', `translate(-50%, 0) scaleY(${header_scale})`)

                for (let i = 0; i < this.main_header_element.children.length; i++) {
                    this.main_header_element.children[i].style.setProperty('transform', `scaleX(${header_scale})`)
                }

                if (window.scrollY < (50 * this.vw)) {
                    this.information_element.style.setProperty('top', `${this.poster_element.clientHeight + window.scrollY}px`)
                    this.artworks_element.style.setProperty('top', `${this.poster_element.clientHeight + this.information_element.clientHeight + window.scrollY}px`)
                }
                else {
                    
                }
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>