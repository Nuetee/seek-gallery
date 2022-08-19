<template>
    <div id="artworkPage" v-if="this.artwork">
        <MainHeader :background_color="'transparent'">
            <template v-slot:default>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13L1 7L7 1" stroke="black" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </template>
        </MainHeader>
        <div class="body">
            <div class="top">
                <div class="artworkTitle poppins">{{ this.artwork.getName() }}</div>
                <ArchiveInfo :archive_count="this.artwork.getArchiveCount()"></ArchiveInfo>
            </div>
            <div class="bottom">
                <div class="artist">{{ this.artwork.getArtist().nickname }}</div>
                <SNSLink :sns_link="this.artwork.getArtist().getSNS()"></SNSLink>
            </div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import ArchiveInfo from '@/widgets/ArchiveInfo.vue';
    import SNSLink from '@/widgets/SNSLink.vue';

    import { Artwork } from '@/classes/artwork';

    export default {
        name: 'ArtworkPage',
        components: { MainHeader, ArchiveInfo, SNSLink },
        data() {
            return {
                id: this.$route.query.id,
                artwork: null,
            };
        },
        async created() {
            this.artwork = await new Artwork(this.id).init()
        },
        beforeMount() {},
        mounted() {
            // const _this = this
            // setTimeout(function() {
            //     window.scrollTo(0, 1000)
            // }, 100)
            
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/ArtworkPage/artworkPage.scss"></style>