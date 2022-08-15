<template>
    <div id="mainPage">
        <MainHeader :background-vue="'white'">
            <template v-slot:default>
                <img src="../assets/seek_logo.png">
            </template>
        </MainHeader>
        <div class="body">
            <div class="poster"></div>
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