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
                    <div :class="['category' + i, { 'selected': (i === this.selected_category_index) }]"
                        v-for="(category, i) in this.category_list"
                        @click="async() => {await this.selectCategory(category, i)}"
                    >
                        {{ this.convetString(category)}}
                    </div>
                </div>
            </div>
            <div id="map"></div>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import { getExhibitionsOnArea  } from '@/modules/map'
    import { Exhibition } from '@/classes/exhibition';

    export default {
        name: 'MapPage',
        components: {
            MainHeader
        },
        data() {
            return {
                map: null,
                category_list: ['\%\%', 'hannam', 'itaewon', 'seongsu'],
                selected_category_index: 0
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
            this.map = new kakao.maps.Map(mapContainer, mapOption)
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            convetString (english) {
                let korean = ''
                switch (english) {
                    case '\%\%':
                        korean = '전체'
                        break
                    case 'hannam':
                        korean = '한남'
                        break
                    case 'itaewon':
                        korean = '이태원'
                        break
                    case 'seongsu':
                        korean = '성수'
                        break
                }
                return korean
            },
            async selectCategory (category, index) {
                if (index === this.selected_category_index)
                    return
                
                this.selected_category_index = index
                await this.setMapByCategory (category)
            },
            async setMapByCategory (category) {
                const MAX_EXHIBITION_NUMBER = 1000
                let exhibition_pageId_list = await getExhibitionsOnArea(category, 0, MAX_EXHIBITION_NUMBER)
                
                let exhibition_map_object_list = new Array()
                let coordinate_sum = new Object()
                coordinate_sum.latitude = 0
                coordinate_sum.longitude = 0

                let i = 0
                for (i = 0; i < exhibition_pageId_list.length; i++) {
                    let object = new Object()
                    let coordinate = await new Exhibition(exhibition_pageId_list[i]).getLocation()
                    coordinate_sum.latitude += parseFloat(coordinate.latitude)
                    coordinate_sum.longitude += parseFloat(coordinate.longitude)
                    
                    object.pageId = exhibition_pageId_list[i]
                    object.coordinate = coordinate

                    exhibition_map_object_list.push(object)
                }
                
                let mean_latitude = coordinate_sum.latitude / i
                let mean_longitude = coordinate_sum.longitude / i
                
                this.setMapCenter(mean_latitude, mean_longitude)
                this.setMarkers(exhibition_map_object_list)
            },
            setMapCenter (latitude, longitude) {
                let moveLatLon = new kakao.maps.LatLng(latitude, longitude)
                this.map.setCenter(moveLatLon)
            },
            setMarkers (exhibition_map_object_list) {
                let marker_image_src = require('../assets/marker.svg')
                let image_size = new kakao.maps.Size(36, 51)

                for (let i = 0; i < exhibition_map_object_list.length; i++) {
                    let coordinate = exhibition_map_object_list[i].coordinate
                    let latlng = new kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)

                    let marker_image = new kakao.maps.MarkerImage(marker_image_src, image_size)

                    let marker = new kakao.maps.Marker({
                        map: this.map,
                        position: latlng,
                        title: exhibition_map_object_list[i].pageId,
                        image: marker_image,
                        clickable: true
                    })
                }

                
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MapPage/mapPage.scss"></style>