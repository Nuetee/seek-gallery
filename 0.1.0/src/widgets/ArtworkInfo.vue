<template>
    <div v-if="this.artwork" class="artworkInfo poppins">
        <div :style="(this.isBack) ? { color : 'black' } : { color: this.color }" class="artworkTitle">
            {{ this.artwork.getName() }}
        </div>
        <div :style="(this.isBack) ? { color: 'black' } : { color: this.color }" class="artist">
            {{ this.artwork.getArtistName() }}
            <SNSLink v-if="this.sns" :artwork="this.artwork"></SNSLink>
        </div>
    </div>
    <div v-else class="artworkInfo poppins">
        <div :style="(this.isBack) ? { color : 'black' } : { color: this.color }" class="artworkTitle">
            {{ this.exhibition.getName() }}
        </div>
        <div :style="(this.isBack) ? { color: 'black' } : { color: this.color }" class="artist">
            {{ this.exhibition.getOwnerName() }}
            <SNSLink v-if="this.sns" :artwork="this.artwork"></SNSLink>
        </div>
    </div>
</template>
<script>
    import SNSLink from '@/widgets/SNSLink.vue'

    export default {
        name: 'ArtworkInfo',
        components: { SNSLink },
        props: {
            artwork: {
                type: Object,
                default: null
            },
            exhibition: {
                type: Object,
                default: null
            },
            isBack: Boolean
        },
        data() {
            return {
                color: (this.artwork.getColor()) 
                    ? this.artwork.getColor()
                    : this.exhibition.getColor(),
                sns: (this.artwork) 
                    ? this.artwork.getSNS()
                    : null
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkInfo.scss"></style>