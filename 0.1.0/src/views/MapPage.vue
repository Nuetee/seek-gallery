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
                    <div class="noExhibition" v-show="this.no_exhibition">해당 카테고리에 진행중인 전시가 없습니다.</div>
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
                <div class="exhibitionDate" ref="exhibitionDate"></div>
                <div class="exhibitionTime" ref='exhibitionTime'></div>
                <div class="exhibitionPlace" ref="exhibitionPlace"></div>
                <a class="exhibitionLink" ref="exhibitionLink">둘러보기</a>
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
                category_list: ['\%\%', 'uljiro', 'hannam', 'seongsu'],
                selected_category_index: 0,
                markers: [],
                selected_marker: null,
                marker_image: null,
                selected_marker_image: null,
                keyword: '',
                no_result: false,
                no_exhibition: false,

                // 임시 프론트
                uljiro_exhibition_list: []
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

            // 임시 을지로 우선
            this.selected_category_index = 1
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
            async setMapByCategory(category, initialize = false) {
                if (category === 'uljiro') {
                    let exhibition_1 = new Object()
                    let exhibition_2 = new Object()
                    let exhibition_3 = new Object()
                    let exhibition_4 = new Object()
                    let exhibition_5 = new Object()
                    let exhibition_6 = new Object()

                    exhibition_1.gallery = '공간형'
                    exhibition_1.introduction = '공간형에서 열리는 김마저 작가의 전시\n공간 내에 고정된 작품들의 사이를 살피고 그것들을 연결짓는 새로운 읽기 방식을 탐구해보세요'
                    exhibition_1.place = '공간형 (서울 중구 을지로 101-2)'
                    exhibition_1.id = 598343139
                    exhibition_1.coordinate = { longitude: 126.989550300605, latitude: 37.5664382420232 }
                    exhibition_1.name = '《形角無》'
                    exhibition_1.artist = ['김마저']
                    exhibition_1.date = '2022.11.5 - 2022.11.20'
                    exhibition_1.time = '수-일 13시 ~ 19시 (*월,화 휴무)'
                    exhibition_1.price = 0
                    exhibition_1.link = 'https://www.instagram.com/artspace_hyeong/'
                    
                    exhibition_2.gallery = '을지예술센터'
                    exhibition_2.introduction = '누군가의 필요에 의해 만들어지는 용도와 누군가의 쓰임에 의해 인정받는 쓸모의 가치를 탐구하는 3부작 중 마지막 전시\n8명의 아티스트가 용접공에서 비건 디자이너까지, 8명의 페르소나를 위해 만든 작품을 만나보세요! '
                    exhibition_2.place = '을지예술센터 (서울 중구 창경궁로5다길 18 3층)'
                    exhibition_2.id = 2008866442
                    exhibition_2.coordinate = { longitude: 126.99659065833822, latitude: 37.56773969328135 }
                    exhibition_2.name = '《용도의 쓸모 - 사용자 친화적》'
                    exhibition_2.artist = ['구수현', '깪', '박소라', '연진영', '이시산', '이윤정', '조효리', '최병석']
                    exhibition_2.date = '2022.11.08 - 2022.12.07'
                    exhibition_2.time = '화-일 13시 ~ 20시 (*월 휴무)'
                    exhibition_2.link = 'https://www.instagram.com/c.enter_official/'

                    exhibition_3.gallery = '스페이스유닛4'
                    exhibition_3.introduction = '인간의 절대고립의 숙명에 대해 말하는 신이명 작가의 전시\n설치, 사진, 드로잉 등 다양한 매체의 작품을 관람할 수 있습니다'
                    exhibition_3.place = '스페이스유닛4 (서울 중구 을지로 143 4층)'
                    exhibition_3.id = 1511830976
                    exhibition_3.coordinate = { longitude: 126.99394205418, latitude: 37.5666583920689 }
                    exhibition_3.name = '《파편의 초상》'
                    exhibition_3.artist = ['신이명']
                    exhibition_3.date = '2022.11.9 - 2022.11.26'
                    exhibition_3.time = ' 수-토 13시 ~ 17시 (*월,화 휴무)'
                    exhibition_3.price = 0
                    exhibition_3.link = 'https://www.instagram.com/gblue_gallery/'
                    
                    exhibition_4.gallery = '그블루 갤러리'
                    exhibition_4.introduction = '작업을 통해 카메라 뒤편에 대해 이야기하는 윤호진 작가의 전시\n벽 어딘가에 부착된 QR코드 링크도 따라가보세요!'
                    exhibition_4.place = '그블루 갤러리 (서울 중구 충무로5길 2 3층)'
                    exhibition_4.id = 138252527
                    exhibition_4.coordinate = { longitude: 126.992472989279, latitude: 37.5652131099018 }
                    exhibition_4.name = '《[Re]:[Re]:[Re]:[Fw]:》'
                    exhibition_4.artist = ['윤호진']
                    exhibition_4.date = '2022.11.9 - 2022.11.27'
                    exhibition_4.time = '수-일 13시 ~ 20시 (*월,화 휴무)'
                    exhibition_4.price = 0
                    exhibition_4.link = 'https://www.instagram.com/gblue_gallery/'

                    exhibition_5.gallery = '상업화랑 을지로'
                    exhibition_5.introduction = '2년 반의 펜데믹 기간이 지나고 다시 일상으로 복귀해가고 있는 시점에서, ‘거주’와 ‘집’의 의미를 되새기는 전시\n상업화랑 용산에서도 동일한 전시를 즐길 수 있다고 합니다!'
                    exhibition_5.place = '상업화랑 을지로 (서울 중구 을지로 143 4층)'
                    exhibition_5.id = 1511830976
                    exhibition_5.coordinate = { longitude: 126.99394205418, latitude: 37.5666583920689 }
                    exhibition_5.name = '<<가택연금>>'
                    exhibition_5.artist = ['강홍구', '노충현', '박진영', '서동욱', '안경수', '옥정호', '윤정미', '정성진', '정용국', '정재호', '최선', '최현숙']
                    exhibition_5.date = '2022.11.5 - 2022.12.4'
                    exhibition_5.time = '화-금 13시 ~ 19시, 토-일 13시 ~ 18시 (*월 휴무)'
                    exhibition_5.price = 0
                    exhibition_5.link = 'https://www.instagram.com/sahngupgallery/'

                    exhibition_6.gallery = '햇빛담요재단'
                    exhibition_6.introduction = '리투아니아 루벤아트파운데이션에 소장된 젊은 작가들의 작품을 마주할 수 있는 전시\n발트 지역의 신선한 예술적 시각과 통찰을 경험해보세요!'
                    exhibition_6.place = '햇빛담요재단 (서울 중구 을지로 95)'
                    exhibition_6.id = 1546954217
                    exhibition_6.coordinate = { longitude: 126.98849991280093, latitude: 37.56633903482297 }
                    exhibition_6.name = '⟪루벤 아트파운데이션 소장품전⟫'
                    exhibition_6.artist = []
                    exhibition_6.date = '2022.9.16 - 2022.11.26'
                    exhibition_6.time = '화-토 11시 ~ 18시 반 (*일,월 휴무)'
                    exhibition_6.price = 0
                    exhibition_6.link = 'https://instagram.com/sunblanketfoundation?igshid=YmMyMTA2M2Y='

                    this.uljiro_exhibition_list = [exhibition_1, exhibition_2, exhibition_3, exhibition_4, exhibition_5, exhibition_6]
                    let mean_latitude = 0
                    let mean_longitude = 0
                    for (let exhibition of this.uljiro_exhibition_list) {
                        mean_latitude += exhibition.coordinate.latitude
                        mean_longitude += exhibition.coordinate.longitude
                    }
                    mean_latitude /= 6
                    mean_longitude /= 6
                    this.setMapCenter(mean_latitude, mean_longitude, initialize)
                    
                    let i = 0
                    for (i = 0; i < this.markers.length; i++) {
                        this.markers[i].setMap(null)
                    }
                    this.markers = new Array(0)

                    // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체
                    let bounds = new kakao.maps.LatLngBounds()

                    for (let i = 0; i < this.uljiro_exhibition_list.length; i++) {
                        let coordinate = this.uljiro_exhibition_list[i].coordinate
                        let latlng = new kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)
                        // LatLngBounds 객체에 좌표 추가
                        bounds.extend(latlng)

                        let marker = new kakao.maps.Marker({
                            map: this.map,
                            position: latlng,
                            title: i,
                            image: this.marker_image,
                            clickable: true
                        })

                        const _this = this
                        kakao.maps.event.addListener(marker, 'click', function () {
                            if (_this.selected_marker === marker) {
                                return
                            }
                            else if (_this.selected_marker !== null) {
                                _this.selected_marker.setImage(_this.marker_image)
                            }
                            marker.setImage(_this.selected_marker_image)
                            _this.selected_marker = marker

                            
                            _this.$refs.exhibitionName.innerText = _this.uljiro_exhibition_list[marker.getTitle()].name
                            _this.$refs.exhibitionInformation.innerText = _this.uljiro_exhibition_list[marker.getTitle()].introduction
                            _this.$refs.exhibitionDate.innerText = '기간 : ' + _this.uljiro_exhibition_list[marker.getTitle()].date
                            _this.$refs.exhibitionTime.innerText = '시간 : ' + _this.uljiro_exhibition_list[marker.getTitle()].time
                            _this.$refs.exhibitionPlace.innerText = '장소 : ' + _this.uljiro_exhibition_list[marker.getTitle()].place
                            _this.$refs.exhibitionLink.setAttribute('href', _this.uljiro_exhibition_list[marker.getTitle()].link)
                            _this.drawer_height = _this.$refs.drawer.$el.clientHeight
                            _this.$refs.drawer.$el.style.setProperty('bottom', `${_this.drawer_height / 3}px`)
                            _this.no_result = false
                        })

                        this.markers.push(marker)
                    }

                    this.map.setBounds(bounds)     
                    return
                }

                const MAX_EXHIBITION_NUMBER = 1000
                let exhibition_pageId_list = await getExhibitionsOnArea(category, 0, MAX_EXHIBITION_NUMBER)
                if (exhibition_pageId_list.length === 0) {
                    this.no_exhibition = true
                    return
                }
                this.no_exhibition = false
                
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