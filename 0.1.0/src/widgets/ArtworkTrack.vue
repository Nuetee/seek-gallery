<template>
    <div class="artworkTrack" :class="this.track_number">
        <div class="category" :style="(this.track.category ? 'margin-top:calc(var(--vw, 1vw) * 3)' : (''))">{{
            this.track?.category }}</div>
        <div class="artwork">
            <div class="artworkThumbnail">
                <img class="thumbnailImage" :class="this.track_number" :src="this.artwork_thumbnail"
                    @click="this.redirectArtworkPage()">
            </div>
            <div class="artworkInformation">
                <div class="artworkName poppins" @click="this.redirectArtworkPage()">{{ this.track?.artwork.getName() }}</div>
                <div class=" artist">{{ this.track?.artwork.getArtist().getNickname() }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkTrack',
        components: {},
        props: {
            track_page_id_array: Array,
            track: Object,
            track_number: String,
            key: Number
        },
        data() {
            return {
                artwork_thumbnail: null,
            };
        },
        async created() {
            this.artwork_thumbnail = await this.track?.artwork.getThumbnailImage()
        },
        mounted() {
            let thumbnail_image_element_class = 'thumbnailImage' + ' ' + this.track_number

            const thumbnail_image_element = document.getElementsByClassName(thumbnail_image_element_class)[0]
            
            thumbnail_image_element.onload = () => {
                this.$emit('track_loaded')
            }
        },
        methods: {
            redirectArtworkPage () {
                alert('redirect to artwork')
                this.$router.push({
                    path: '/artwork',
                    query: {
                        array: this.track_page_id_array,
                        index: this.track_number
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkTrack.scss"></style>