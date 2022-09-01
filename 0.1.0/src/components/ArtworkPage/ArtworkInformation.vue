<template>
    <div class="artworkInformation">
        <ArtworkCoreInfo :artwork="this.artwork"></ArtworkCoreInfo>
        <ArtworkBasicInfo :artwork="this.artwork"></ArtworkBasicInfo>
    </div>
</template>
<script>
    import ArtworkCoreInfo from './ArtworkCoreInfo.vue';
    import ArtworkBasicInfo from './ArtworkBasicInfo.vue';
    export default {
        name: 'ArtworkInformation',
        props: {
            artwork: Object
        },
        components: { 
            ArtworkCoreInfo,
            ArtworkBasicInfo
        },
        data() {
            return {
                sampleData: ''
            };
        },
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkInformation.scss"></style>