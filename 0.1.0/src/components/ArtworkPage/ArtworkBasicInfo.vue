<template>
    <div class="artworkBasicInfo">
        <ArtworkMoreInfo :artwork="this.artwork"></ArtworkMoreInfo>
        <ArtworkTableInfo :artwork="this.artwork"></ArtworkTableInfo>
    </div>
</template>
<script>
    import ArtworkMoreInfo from './ArtworkMoreInfo.vue';
    import ArtworkTableInfo from './ArtworkTableInfo.vue';

    export default {
        name: 'ArtworkBasicInfo',
        components: {
            ArtworkMoreInfo,
            ArtworkTableInfo
        },
        props: {
            artwork: Object
        },
        data() {
            return {
                sampleData: ''
            };
        },
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkBasicInfo.scss"></style>