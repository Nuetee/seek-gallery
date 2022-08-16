<template>
    <div id="mainPage">
        <MainHeader :background_color="'white'">
            <template v-slot:default>
                <img src="../assets/seek_logo.png">
            </template>
        </MainHeader>
        <div class="body">
            <div class="poster">
                <img src="../assets/766f3bd97f3c9cbc47e7347ba6c665c2.jpg">
            </div>
            <div class="ghost">

            </div>
            <div class="exhibitionTitle">
                <TitleHeader></TitleHeader>
            </div>
            <div class="exhibitionArtworks">
                <TitleHeader></TitleHeader>
                <ArtworkTrackList></ArtworkTrackList>
            </div>
        </div>
    </div>
</template>
<script>
import MainHeader from '@/widgets/MainHeader.vue';
import TitleHeader from '@/widgets/TitleHeader.vue';
import ArtworkTrackList from '@/widgets/ArtworkTrackList.vue';
    export default {
        name: 'MainPage',
        components: {
            MainHeader,
            TitleHeader,
            ArtworkTrackList
        },
        data() {
            return {
                sampleData: ''
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/MainPage/mainPage.scss"></style>