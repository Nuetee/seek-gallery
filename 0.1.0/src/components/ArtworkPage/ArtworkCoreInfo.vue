<template>
    <div class="artworkInfo poppins">
        <div class="artworkTitle">
            {{ this.artwork.getName() }}
        </div>
        <div class="artist">
            {{ this.artwork.getArtist().getNickname() }}
            <SNSLink :sns_link="this.artwork.getArtist().getSNS()"></SNSLink>
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