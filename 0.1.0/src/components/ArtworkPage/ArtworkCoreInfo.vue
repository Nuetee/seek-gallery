<template>
    <div class="artworkInfo poppins">
        <div class="artworkTitle">
            {{ this.artwork ? this.artwork.getName() : '' }}
        </div>
        <div class="artist">
            {{ this.artwork ? this.artwork.getArtistName() : '' }}
            <SNSLink :sns_link="this.artwork ? this.artwork.getArtist().getSNS() : ''"></SNSLink>
        </div>
    </div>
</template>
<script>
    import SNSLink from '@/widgets/SNSLink.vue'

    export default {
        name: 'ArtworkInfo',
        components: { SNSLink },
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