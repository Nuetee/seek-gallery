<template>
    <div v-if="this.artwork" class="artworkInfo poppins">
        <div :style="{ color: 'black' }" class="artworkTitle">
            {{ this.artwork.getName() }}
        </div>
        <div :style="{ color: 'black' }" class="artist">
            {{ this.artwork.getArtistName() }}
        </div>
    </div>
    <div v-else-if="this.exhibition" class="artworkInfo poppins">
        <div :style="{ color: 'black' }" class="artworkTitle">
            {{ this.exhibition.getName() }}
        </div>
        <div :style="{ color: 'black' }" class="artist">
            {{ this.exhibition.getOwnerName() }}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkInfo',
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
                sampleData: ''
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkInfo.scss"></style>