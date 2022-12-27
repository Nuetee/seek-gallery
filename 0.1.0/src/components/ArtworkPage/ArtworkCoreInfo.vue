<template>
    <div class="artworkInfo">
        <div class="artworkTitle">
            {{ this.artwork ? this.artwork.getName() : '' }}
        </div>
        <div class="artist">
            {{ this.artwork ? this.artwork.getArtistName() : '' }}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkInfo',
        components: { },
        props: {
            artwork: Object,
        },
        data() {
            return {
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkCoreInfo.scss"></style>