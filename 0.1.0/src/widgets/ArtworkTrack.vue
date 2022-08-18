<template>
    <div class="artworkTrack" :class="this.track_number">
        <div class="category" :style="(this.track.category ? 'margin-top:calc(var(--vw, 1vw) * 3)' : (''))">{{ this.track?.category }}</div>
        <div class="artwork">
            <div class="artworkThumbnail">
                <img class="thumbnailImage" :class="this.track_number" :src="this.artwork_thumbnail" alt="">
            </div>
            <div class="artworkInformation">
                <div class="artworkName poppins">{{ this.track?.artwork.getName() }}</div>
                <div class="artist">{{ this.track?.artwork.getArtist().getNickname() }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkTrack',
        components: {},
        props: {
            track: Object,
            track_number: String
        },
        data() {
            return {
                artwork_thumbnail: null,
            };
        },
        beforeCreate() {},
        async created() {
            this.artwork_thumbnail = await this.track?.artwork.getThumbnailImage()
        },
        beforeMount() {},
        mounted() {

            let thumbnail_image_element_class = 'thumbnailImage' + ' ' + this.track_number

            const thumbnail_image_element = document.getElementsByClassName(thumbnail_image_element_class)[0]
            
            thumbnail_image_element.onload = () => {
                this.$emit('track_loaded')
            }
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkTrack.scss"></style>