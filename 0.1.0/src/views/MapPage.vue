<template>
    <div id="mapPage">
        <MainHeader>
            <template v-slot:left>
                <img src="../assets/seek_logo.png" @click="() => {this.$router.push({ path: '/', })}">
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
                    <div class="search">
                        <input type="text" id="keyword" placeholder="전시제목" v-model="this.keyword">
                        <div class="searchButton" @click="async () => { await this.searchExhibition(this.keyword) }">검색</div>
                    </div>
                    <div class="noResult" v-show="this.no_result">검색 결과가 없습니다.</div>
                    <div class="categoryContainer">
                        <div :class="['category' + i, { 'selected': (i === this.selected_category_index) }]"
                            v-for="(category, i) in this.category_list" @click="async() => {await this.selectCategory(category, i)}">
                            {{ this.convetString(category)}}
                        </div>
                    </div>
                </div>
                
                
            </div>
            <div id="map"></div>
        </div>
        <Drawer :class_name="'exhibition'" ref="drawer">
            <template v-slot:default>
                <div class="exhibitionName" ref="exhibitionName"></div>
                <div class="exhibitionInformation" ref="exhibitionInformation"></div>
            </template>
        </Drawer>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import Drawer from '@/widgets/Drawer.vue';
    import { getExhibitionsOnArea  } from '@/modules/map'
    import { Exhibition } from '@/classes/exhibition';

    export default {
        name: 'MapPage',
        components: {
            MainHeader,
            Drawer
        },
        data() {
            return {
                map: null,
                category_list: ['\%\%', 'hannam', 'seongsu', 'uljiro'],
                selected_category_index: 0,
                markers: [],
                selected_marker: null,
                marker_image: null,
                selected_marker_image: null,
                keyword: '',
                no_result: false
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        async mounted() {
            document.getElementById('app').style.setProperty('overflow', 'hidden')
            let marker_image_src = require('../assets/marker.svg')
            let marker_image_size = new kakao.maps.Size(36, 51)
            this.marker_image = new kakao.maps.MarkerImage(marker_image_src, marker_image_size)

            let selected_marker_image_src = require('../assets/marker_selected.svg')
            let selected_marker_image_size = new kakao.maps.Size(45, 64)
            this.selected_marker_image = new kakao.maps.MarkerImage(selected_marker_image_src, selected_marker_image_size)

            this.selected_category_index = 0
            await this.setMapByCategory(this.category_list[this.selected_category_index], true)
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {
            document.getElementById('app').style.setProperty('overflow', 'scroll')
        },
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
                    case 'bukcheon':
                        korean = '북촌'
                        break
                    case 'nonhyeon':
                        korean = '논현'
                        break
                    case 'yeonnam':
                        korean = '연남'
                        break
                    case 'uljiro':
                        korean = '을지로'
                        break
                    case 'munrae':
                        korean = '문래'
                        break
                    default:
                        korean = 'wrong_category'
                }
                return korean
            },
            async selectCategory (category, index) {
                if (index === this.selected_category_index)
                    return
                
                this.selected_category_index = index
                await this.setMapByCategory (category)
                this.no_result = false
            },
            async setMapByCategory (category, initialize=false) {
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
                
                this.setMapCenter(mean_latitude, mean_longitude, initialize)
                this.setMarkers(exhibition_map_object_list)
            },
            setMapCenter (latitude, longitude, initialize=false) {
                let moveLatLon = new kakao.maps.LatLng(latitude, longitude)
                if (initialize) {
                    let mapContainer = document.getElementById('map')
                    let mapOption = {
                        center: moveLatLon,
                        level: 3
                    }
                    this.map = new kakao.maps.Map(mapContainer, mapOption) 
                    
                    return
                }
                this.map.setCenter(moveLatLon)
            },
            setMarkers (exhibition_map_object_list) {
                // 기존의 마커들 삭제
                let i = 0
                for (i = 0; i < this.markers.length; i++) {
                    this.markers[i].setMap(null)
                }
                this.markers = new Array(0)

                // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체
                let bounds = new kakao.maps.LatLngBounds()

                for (let i = 0; i < exhibition_map_object_list.length; i++) {
                    let coordinate = exhibition_map_object_list[i].coordinate
                    let latlng = new kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)
                    // LatLngBounds 객체에 좌표 추가
                    bounds.extend(latlng)

                    let marker = new kakao.maps.Marker({
                        map: this.map,
                        position: latlng,
                        title: exhibition_map_object_list[i].pageId,
                        image: this.marker_image,
                        clickable: true
                    })
                    
                    const _this = this
                    kakao.maps.event.addListener(marker, 'click', async function () {
                        await _this.clickMarker(marker)
                    })

                    this.markers.push(marker)
                }

                this.map.setBounds(bounds)                
            },
            async clickMarker (marker) {
                if (this.selected_marker === marker) {
                    return
                }
                else if (this.selected_marker !== null) {
                    this.selected_marker.setImage(this.marker_image)
                }
                marker.setImage(this.selected_marker_image)
                this.selected_marker = marker

                await this.setDrawer(this.selected_marker.getTitle())
                this.no_result = false
            },
            async setDrawer (exhibition_pageId) {
                let exhibition = await new Exhibition(exhibition_pageId).init()
                
                this.$refs.exhibitionName.innerText = exhibition.getName()
                this.$refs.exhibitionInformation.innerText = exhibition.getInformation()
                this.drawer_height = this.$refs.drawer.$el.clientHeight
                this.$refs.drawer.$el.style.setProperty('bottom', `${this.drawer_height / 3}px`)
            },
            async searchExhibition (keyword) {
                let keyword_except_blank = keyword
                while (keyword_except_blank.includes(' ')) {
                    keyword_except_blank = keyword_except_blank.replace(' ', '')
                }

                const MAX_EXHIBITION_NUMBER = 1000
                let whole_exhibition_pageId_list = await getExhibitionsOnArea('\%\%', 0, MAX_EXHIBITION_NUMBER)
                let result_exhibition_object_list = new Array()
                let coordinate_sum = new Object()
                coordinate_sum.latitude = 0
                coordinate_sum.longitude = 0
                
                let i = 0
                for (i = 0; i < whole_exhibition_pageId_list.length; i++) {
                    let pageId = whole_exhibition_pageId_list[i]
                    let exhibition = await new Exhibition(pageId).init()
                    let exhibition_name = exhibition.getName()
                    
                    while (exhibition_name.includes(' ')) {
                        exhibition_name = exhibition_name.replace(' ', '')
                    }
                    
                    if (exhibition_name.match(new RegExp(keyword_except_blank, "i")) !== null) {
                        let coordinate = await exhibition.getLocation()
                        coordinate_sum.latitude += parseFloat(coordinate.latitude)
                        coordinate_sum.longitude += parseFloat(coordinate.longitude)

                        let object = new Object()
                        object.pageId = pageId
                        object.coordinate = coordinate
                        result_exhibition_object_list.push(object)
                    }
                }

                if (result_exhibition_object_list.length === 0) {
                    this.no_result = true
                    return
                }
                let mean_latitude = coordinate_sum.latitude / result_exhibition_object_list.length
                let mean_longitude = coordinate_sum.longitude / result_exhibition_object_list.length

                this.setMapCenter(mean_latitude, mean_longitude)
                this.setMarkers(result_exhibition_object_list)
                this.no_result = false
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MapPage/mapPage.scss"></style>