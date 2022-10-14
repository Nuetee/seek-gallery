<template>
    <div id="mapPage">
        <MainHeader>
            <template v-slot:left>
                <img src="../assets/seek_logo.png">
            </template>
            <template v-slot:right>
                <div>About us</div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </template>
        </MainHeader>
        <div class="body">
            <div class="controlContainer">
                <div class="phrase">
                    지금 열리고 있는 전시를<br>
                    확인해 보세요!
                </div>
                <div class="searchContainer">
                    <input type="text" id="keyword" placeholder="전시제목">
                    <div class="searchButton"> 검색</div>
                </div>
                <div class="categoryContainer">
                    <div class="category" v-for="(category, i) in this.sample_category_list">{{category}}</div>
                </div>
            </div>
            <div id="map"></div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';

    export default {
        name: 'MapPage',
        components: {
            MainHeader
        },
        data() {
            return {
                sample_category_list: ['전체', '성수', '북촌', '강남']
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {
            let mapContainer = document.getElementById('map')
            let mapOption = {
                center: new kakao.maps.LatLng(37.535 ,126.997),
                level: 3
            }
            let map = new kakao.maps.Map(mapContainer, mapOption)
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/MapPage/mapPage.scss"></style>