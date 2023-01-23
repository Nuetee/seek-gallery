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
                <a class="exhibitionLink" ref="exhibitionLink" target="_blank">둘러보기</a>
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
                category_list: ['\%\%', 'jamsil', 'seongsu', 'uljiro', 'itaewon', 'mapo', 'bukcheon', 'insadong', 'pyeongchangdong', 'seochon', 'gangnam', 'munrae'],
                selected_category_index: 0,
                markers: [],
                selected_marker: null,
                marker_image: null,
                selected_marker_image: null,
                keyword: '',
                no_result: false,
                no_exhibition: false,

                // 임시 프론트
                jamsil_exhibition_list: [
                    {
                        gallery: '소마미술관',
                        introduction: '',
                        place: '서울 송파구 위례성대로 51 2관',
                        id: 12443890,
                        coordinate: { longitude: 127.1180061737, latitude: 37.51688603716 },
                        name: '《뒤뷔페 전》',
                        artist: ['기획전'],
                        date: '2022.10.01 - 2023.02.05',
                        time: '',
                        price: 20000,
                        link: 'https://instagram.com/soma_museum?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '롯데갤러리 잠실',
                        introduction: '',
                        place: '서울 송파구 올림픽로 300 롯데월드타워 6층',
                        id: 1398479164,
                        coordinate: { longitude: 127.1025, latitude: 37.5126405126229 },
                        name: '《고요의 순간》',
                        artist: ['Alfie Caine'],
                        date: '2022.12.09 - 2023.02.19',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/lottegallery_official?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '롯데뮤지엄',
                        introduction: '',
                        place: '서울 송파구 올림픽로 300 롯데월드타워 7층',
                        id: 1398479164,
                        coordinate: { longitude: 127.1026, latitude: 37.5126405126229 },
                        name: '',
                        artist: ['Martin Margiela'],
                        date: '2022.12.24 - 2023.03.26',
                        time: '',
                        price: 19000,
                        link: 'https://instagram.com/lottemuseum?igshid=YmMyMTA2M2Y='
                    },
                ],
                seongsu_exhibition_list: [
                    {
                        gallery: '그라운드시소 성수',
                        introduction: '',
                        place: '서울특별시 성동구 아차산로17길 49 생각공장 데시앙플렉스 지하 1층',
                        id: 290027091,
                        coordinate: { longitude: 127.065279873384, latitude: 37.5467681032114 },
                        name: '《나탈리 카르푸셴코 사진전》',
                        artist: ['기획전'],
                        date: '2022.12.23 - 2023.05.07',
                        time: '',
                        price: 15000,
                        link: ''
                    },
                    {
                        gallery: 'PFS 갤러리',
                        introduction: '',
                        place: '서울 성동구 왕십리로6길 4-8 1층',
                        id: 2064925301,
                        coordinate: { longitude: 127.0451074128326, latitude: 37.5459 },
                        name: '《COLORS AND THE LIGHT》',
                        artist: ['이아람'],
                        date: '2022.12.30 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/pfs_gallery?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: 'PFS 갤러리',
                        introduction: '',
                        place: '서울 성동구 왕십리로6길 4-8 1층',
                        id: 2064925301,
                        coordinate: { longitude: 127.0451074128326, latitude: 37.54585 },
                        name: '《이불전》',
                        artist: ['이강'],
                        date: '2022.12.30 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/pfs_gallery?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '스타트플러스',
                        introduction: '',
                        place: '서울 성동구 왕십리로 76',
                        id: 778461860,
                        coordinate: { longitude: 127.045099686985, latitude: 37.544352045605 },
                        name: '《Thanking You》',
                        artist: ['Ohnim'],
                        date: '2022.12.16 - 2023.02.05',
                        time: '',
                        price: 15000,
                        link: 'https://instagram.com/start.art.seoul?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: 'CDA 갤러리',
                        introduction: '',
                        place: '서울 성동구 성수일로10가길 4 지하1층',
                        id: 302480245,
                        coordinate: { longitude: 127.051964033802, latitude: 37.5480000722261 },
                        name: '《FROM THE MASS》',
                        artist: ['콰야'],
                        date: '2023.01.20 - 2023.02.11',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/cdagallery.kr?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '앵포르멜',
                        introduction: '',
                        place: '서울 성동구 연무장길 28-8 트라이베카 빌딩 2층',
                        id: 1816643875,
                        coordinate: { longitude: 127.052401954978, latitude: 37.5431272757837 },
                        name: '《IN MY ROOM》',
                        artist: ['스테레오그램'],
                        date: '2023.01.17 - 2023.02.11',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/informel_official?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '다이브인 성수',
                        introduction: '',
                        place: '서울 성동구 아차산로13길 31 2층',
                        id: 841541749,
                        coordinate: { longitude: 127.061523350619, latitude: 37.5458736262864 },
                        name: '《SURF》',
                        artist: ['다니엘 신'],
                        date: '2023.01.06 - 2023.01.28',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/divein_seoul/'
                    },
                    {
                        gallery: '틸테이블',
                        introduction: '',
                        place: '서울 성동구 아차산로 120 1층',
                        id: 14866998,
                        coordinate: { longitude: 127.05724845084552, latitude: 37.543970793728704 },
                        name: '《LO&FRECKLES FOREST》',
                        artist: ['이슬로'],
                        date: '2023.01.12 - 2023.02.23',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/tealtable__official?igshid=YmMyMTA2M2Y='
                    },
                ],
                uljiro_exhibition_list: [
                    {
                        gallery: 'DDP 동대문디자인플라자',
                        introduction: '',
                        place: '서울 중구 을지로 281 지하 2층 전시 1관',
                        id: 25753389,
                        coordinate: { longitude: 127.011536427721, latitude: 37.5671156897561 },
                        name: '《그러면, 거기》',
                        artist: ['장 줄리앙'],
                        date: '2022.10.1 - 2023.01.24',
                        time: '',
                        price: 20000,
                        link: 'https://www.instagram.com/gallery_huette/'
                    },
                    {
                        gallery: '롯데갤러리 본점',
                        introduction: '',
                        place: '서울 중구 을지로 30 롯데백화점',
                        id: 25042430,
                        coordinate: { longitude: 126.981799345353, latitude: 37.5652263628578 },
                        name: '《The Great Outdoors》',
                        artist: ['김경민', '김지구', '윤상윤', '키미작'],
                        date: '2023.01.13 - 2023.03.02',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/lottegallery_official?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: 'YK Presents',
                        introduction: '',
                        place: '서울 중구 을지로43길 13 대화빌딩',
                        id: 1729186886,
                        coordinate: { longitude: 127.006802759083, latitude: 37.5668890064546 },
                        name: '《Binary Sunset View》',
                        artist: ['이연석', '이용재'],
                        date: '2023.01.07 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/yk_presents?igshid=YmMyMTA2M2Y='
                    },
                ],
                seongbuk_exhibition_list: [
                ],
                itaewon_exhibition_list: [
                    {
                        gallery: '갤러리 바톤',
                        introduction: '',
                        place: '서울 용산구 동서당로 116',
                        id: 9085363,
                        coordinate: { longitude: 127.01217435522621, latitude: 37.53639879490747 },
                        name: '《Faint Afterglow》',
                        artist: ['기획전'],
                        date: '2023.01.11 - 2023.02.18',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/gallerybaton?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '현대카드 스토리지',
                        introduction: '',
                        place: '서울 용산구 이태원로 248',
                        id: 1613335532,
                        coordinate: { longitude: 127.00085990334, latitude: 37.5368030675472 },
                        name: '《DRIFT : In Sync with the Earth》',
                        artist: ['현대카드 스토리지'],
                        date: '2022.12.08 - 2023.04.16',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/hyundaicard_dive/'
                    },
                    {
                        gallery: '타데우스 로팍',
                        introduction: '',
                        place: '서울 용산구 독서당로 122-1',
                        id: 612582743,
                        coordinate: { longitude: 127.012855562366, latitude: 37.5368465199743 },
                        name: '《지금 우리의 신화》',
                        artist: ['그룹전'],
                        date: '2023.01.06 - 2023.02.25',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/thaddaeusropac/'
                    },
                    {
                        gallery: 'VSF',
                        introduction: '',
                        place: '서울 용산구 독서당로 79',
                        id: 129306809,
                        coordinate: { longitude: 127.009178033538, latitude: 37.5343294671483 },
                        name: '《Imaginary Intervention》',
                        artist: ['존 밀러'],
                        date: '2023.01.07 - 2023.02.25',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/vsf/'
                    },
                    {
                        gallery: '갤러리조은',
                        introduction: '',
                        place: '용산구 이태원로 55가길 3 1층',
                        id: 27387673,
                        coordinate: { longitude: 127.00073545569826, latitude: 37.538030230937444 },
                        name: '《Small Lucky》',
                        artist: ['소품락희전'],
                        date: '2022.12.22 - 2023.02.04',
                        time: '',
                        price: 0,
                        link: 'https://galleryjoeun.com/kor/exhibitions/current.php'
                    },
                ],
                mapo_exhibition_list: [
                    {
                        gallery: '챕터투',
                        introduction: '',
                        place: '서울 마포구 동교로27길 54',
                        id: 927286713,
                        coordinate: { longitude: 126.921203611709, latitude: 37.5602928429239 },
                        name: '창끝의 궤적',
                        artist: ['이재석'],
                        date: '2023.01.12 - 2023.02.25',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/chapterii_/'
                    },
                    {
                        gallery: '온수공간',
                        introduction: '',
                        place: '서울 마포구 월드컵북로1길 74',
                        id: 1993482544,
                        coordinate: { longitude: 126.917815663776, latitude: 37.5534898065016 },
                        name: '모와 모 사이',
                        artist: ['이경민'],
                        date: '2023.01.12 - 2023.01.24',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/os_gonggan/'
                    },
                    {
                        gallery: '플레이스막2',
                        introduction: '',
                        place: '서울 서대문구 홍제천로4길 39-26',
                        id: 11922740,
                        coordinate: { longitude: 126.92654312673675, latitude: 37.57447975885542 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/placemak/'
                    },
                    {
                        gallery: '별관',
                        introduction: '',
                        place: '서울 마포구 망원로 74 2층',
                        id: 745738833,
                        coordinate: { longitude: 126.90497740913551, latitude: 37.55721931159651 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/outhouse.seoul/'
                    },
                    {
                        gallery: 'www스페이스',
                        introduction: '',
                        place: '서울 마포구 망원로6길 37 지하 1층',
                        id: 250331355,
                        coordinate: { longitude: 126.903802888715, latitude: 37.5552668005838 },
                        name: '⟪화이트홀로 가는길⟫',
                        artist: ['신선영'],
                        date: '2023.01.18 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/www__space/'
                    },
                    {
                        gallery: '레인보우큐브',
                        introduction: '',
                        place: '서울 마포구 토정로2길 6-19',
                        id: 27583491,
                        coordinate: { longitude: 126.912914133552, latitude: 37.5448403130809 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/rainbowcube_gallery/'
                    },
                    {
                        gallery: '파도',
                        introduction: '',
                        place: '서울 마포구 성미산로 198 ',
                        id: 227193375,
                        coordinate: { longitude: 126.91802418609045, latitude: 37.54909308101398 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/pado_spacewave/'
                    },
                    {
                        gallery: '챕터투',
                        introduction: '',
                        place: '서울 마포구 동교로27길 54',
                        id: 927286713,
                        coordinate: { longitude: 126.921203611709, latitude: 37.5602928429239 },
                        name: '《물거품, 휘파람(Rales, Wheezes and Crackles)》',
                        artist: [],
                        date: '2022.11.16 - 2022.12.17',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/chapterii_/'
                    },
                    {
                        gallery: 'CR Collective',
                        introduction: '',
                        place: '서울 마포구 성미산로 120 2층',
                        id: 711560264,
                        coordinate: { longitude: 126.92028678196, latitude: 37.5624798470126 },
                        name: '《대체불가현실: □☞∴∂★∽콜렉티브》',
                        artist: ['기획전'],
                        date: '2022.12.08 - 2023.01.28',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/cr_collective_/'
                    },
                    {
                        gallery: '화인페이퍼',
                        introduction: '',
                        place: '서울 마포구 연남동1길30',
                        id: 695206553,
                        coordinate: { longitude: 126.92135737062624, latitude: 37.56045152085452 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/finepaper_gallery/'
                    },
                    {
                        gallery: '갤러리 아미디 연남',
                        introduction: '',
                        place: '서울 마포구 성미산로29안길 18 2층',
                        id: 420416612,
                        coordinate: { longitude: 126.923227927727, latitude: 37.5651784776228 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery_amidi/'
                    },
                ],
                bukcheon_exhibition_list: [
                    {
                        gallery: '아트선재센터',
                        introduction: '',
                        place: '서울 종로구 율곡로3길 87 1전시실',
                        id: 8474452,
                        coordinate: { longitude: 126.981836609, latitude: 37.5795738136114 },
                        name: '포스트미',
                        artist: ['강현선'],
                        date: '2022.12.08 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/artsonje_center/'
                    },
                    {
                        gallery: '아트선재센터',
                        introduction: '',
                        place: '서울 종로구 율곡로3길 87 1전시실',
                        id: 8474452,
                        coordinate: { longitude: 126.981836609, latitude: 37.5795738136114 },
                        name: '왼쪽 얼굴',
                        artist: ['오형근'],
                        date: '2022.12.08 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/artsonje_center/'
                    },
                    {
                        gallery: '갤러리41',
                        introduction: '',
                        place: '서울 종로구 삼청로 22-31 1층',
                        id: 19183348,
                        coordinate: { longitude: 126.980505717692, latitude: 37.5778220688486 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery41_seoul/'
                    },
                    {
                        gallery: '크래프트온더힐',
                        introduction: '',
                        place: '서울 종로구 북촌로7길 20 1층',
                        id: 974437016,
                        coordinate: { longitude: 126.983890004886, latitude: 37.5806462943974 },
                        name: 'Open Up',
                        artist: ['6인 그룹전'],
                        date: '2022.12.21 - 2023.01.28',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/crafts_on_the_hill_/'
                    },
                    {
                        gallery: '코너갤러리',
                        introduction: '',
                        place: '서울 종로구 북촌로5길 18',
                        id: 27139183,
                        coordinate: { longitude: 126.98394233236853, latitude: 37.5794813164535 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/corner_gallery/'
                    },
                    {
                        gallery: '뮤지엄헤드',
                        introduction: '',
                        place: '서울 종로구 계동길 84-3 1층',
                        id: 983287184,
                        coordinate: { longitude: 126.98696472317121, latitude: 37.581253042755144 },
                        name: '⟪Rock & Roll⟫',
                        artist: ['문이삭'],
                        date: '2022.11.24 - 2023.01.28',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/museumhead_/'
                    },
                    {
                        gallery: '국제갤러리',
                        introduction: '',
                        place: '서울 종로구 삼청로 54',
                        id: 12447481,
                        coordinate: { longitude: 126.980459686997, latitude: 37.5806836181488 },
                        name: '⟪Image, Symbol, Prayer⟫',
                        artist: ['코라크릿 아룬나논차이'],
                        date: '2022.12.15 - 2023.01.29',
                        time: '',
                        price: 0,
                        link: ''
                    },
                ],
                insadong_exhibition_list: [
                    {
                        gallery: '선갤러리',
                        introduction: '',
                        place: '서울 종로구 인사동5길 8',
                        id: 13530402,
                        coordinate: { longitude: 126.985732297022, latitude: 37.5729250096653 },
                        name: 'Winter Masterpieces',
                        artist: ['기획전'],
                        date: '2023.01.11 - 2023.02.11',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/sungallery_1977?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: 'ap갤러리',
                        introduction: '',
                        place: '서울 종로구 인사동길 40 2층',
                        id: 1018843728,
                        coordinate: { longitude: 126.985111746173, latitude: 37.574009730872 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/ap.gallery.seoul/'
                    },
                    {
                        gallery: '갤러리 가이아',
                        introduction: '',
                        place: '서울 종로구 인사동길 57-1',
                        id: 8653346,
                        coordinate: { longitude: 126.983467821465, latitude: 37.5750943097354 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/galeriegaia/'
                    },
                    {
                        gallery: '인영갤러리',
                        introduction: '',
                        place: '서울 종로구 인사동10길 23-4',
                        id: 321192268,
                        coordinate: { longitude: 126.98625270075253, latitude: 37.57464056557581 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/inyounggallery/'
                    },
                    {
                        gallery: '관훈갤러리',
                        introduction: '',
                        place: '서울 종로구 인사동11길 11',
                        id: 12447680,
                        coordinate: { longitude: 126.984237861444, latitude: 37.5738654582578 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/kwanhoongallery/'
                    }
                ],
                pyeongchangdong_exhibition_list: [
                    {
                        gallery: '본 갤러리',
                        introduction: '',
                        place: '서울 종로구 자하문로 299',
                        id: 18578840,
                        coordinate: { longitude: 126.95960522563229, latitude: 37.59910001285726 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/bon__gallery/'
                    },
                ],
                gwanghwamun_exhibition_list: [
                ],
                seochon_exhibition_list: [
                    {
                        gallery: '갤러리 아트사이드',
                        introduction: '',
                        place: '서울 종로구 자하문로6길 15 1층',
                        id: 8428388,
                        coordinate: { longitude: 126.97294784304906, latitude: 37.578267471918814 },
                        name: '《그래서, 나의 시선 끝은》',
                        artist: ['김시안', '정소윤', '허찬미'],
                        date: '2023.01.13 - 2023.02.11',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/artsidegallery_/'
                    },
                    {
                        gallery: '아트스페이스 보안 1',
                        introduction: '',
                        place: '아트스페이스 보안 1 서울 종로구 효자로 33',
                        id: 14562864,
                        coordinate: { longitude: 126.97364079381301, latitude: 37.57910825301889 },
                        name: '《얇은 밀도》',
                        artist: ['구나'],
                        date: '2022.11.26 - 2022.12.18',
                        time: '화-일 12시 ~ 18시 (*월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/boan1942/'
                    },
                    {
                        gallery: '아트스페이스 보안 2',
                        introduction: '',
                        place: '서울 종로구 효자로 33 보안1942 지하 1층',
                        id: 14562864,
                        coordinate: { longitude: 126.97357900000000, latitude: 37.57914000000000 },
                        name: '《너의 이름을 부를 때》',
                        artist: ['이희경'],
                        date: '2022.12.23 - 2023.01.25',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/boan1942/'
                    },
                    {
                        gallery: '갤러리시몬',
                        introduction: '',
                        place: '서울 종로구 자하문로6길 20',
                        id: 8778944,
                        coordinate: { longitude: 126.97329204906, latitude: 37.5781161832806 },
                        name: '⟪쌍-댓구 Pairs⟫',
                        artist: ['윤동천'],
                        date: '2022.10.20 - 2022.12.31',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery_simon/'
                    },
                    {
                        gallery: '스페이스로',
                        introduction: '',
                        place: '서울 종로구 필운대로7길 12 2층',
                        id: 418628988,
                        coordinate: { longitude: 126.967847531568, latitude: 37.5815890583045 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/hellospacelo/'
                    },
                    {
                        gallery: '스페이스깨',
                        introduction: '',
                        place: '서울 종로구 자하문로5길 15',
                        id: 1050667060,
                        coordinate: { longitude: 126.970969217053, latitude: 37.5776290980353 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/spaceccae/'
                    },
                    {
                        gallery: '그라운드시소 서촌',
                        introduction: '',
                        place: '서울 종로구 자하문로6길 18-8',
                        id: 341652379,
                        coordinate: { longitude: 126.972916300185, latitude: 37.5778385914657 },
                        name: '⟪어노니머스 프로젝트: 우리가 멈춰섰던 순간들⟫',
                        artist: ['아마추어 사진 컬렉션'],
                        date: '2022.11.25 - 2023.04.30',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/groundseesaw/'
                    },
                ],
                yongsan_exhibition_list: [
                ],
                gangnam_exhibition_list: [
                    {
                        gallery: '예술의전당 한가람미술관',
                        introduction: '',
                        place: '서울 서초구 남부순환로 2406',
                        id: 20496825,
                        coordinate: { longitude: 127.0142, latitude: 37.4804281441544 },
                        name: '《어제의 미래》',
                        artist: ['마리아 스바르보바'],
                        date: '2022.12.10 - 2023.02.26',
                        time: '',
                        price: 20000,
                        link: 'https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '예술의전당 한가람미술관',
                        introduction: '',
                        place: '서울 서초구 남부순환로 2406',
                        id: 20496825,
                        coordinate: { longitude: 127.014236530093, latitude: 37.4804281441544 },
                        name: '《Mickey Mouse Now And Future》',
                        artist: ['기획전'],
                        date: '2022.12.10 - 2023.04.09',
                        time: '',
                        price: 20000,
                        link: 'https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '예술의전당 한가람미술관',
                        introduction: '',
                        place: '서울 서초구 남부순환로 2406',
                        id: 20496825,
                        coordinate: { longitude: 127.0144, latitude: 37.48042 },
                        name: '《WATSON, THE MAESTRO》',
                        artist: ['기획전'],
                        date: '2022.12.08 - 2023.03.30',
                        time: '',
                        price: 20000,
                        link: 'https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y='
                    },
                    {
                        gallery: '갤러리 띠오',
                        introduction: '',
                        place: '서울 서초구 강남대로97길 27 1층',
                        id: 1622537281,
                        coordinate: { longitude: 127.01826070161901, latitude: 37.51442436828548 },
                        name: '《Dreaming of》',
                        artist: ['김우진', 'Marcelo Suaznabar'],
                        date: '2023.01.06 - 2023.01.27',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/theogallery_official/'
                    },
                ],
                munrae_exhibition_list: [
                    {
                        gallery: '구캔갤러리',
                        introduction: '',
                        place: '서울 구로구 경인로 661 신도림1차푸르지오 101동 306호',
                        id: 1315584631,
                        coordinate: { longitude: 126.886987229389, latitude: 37.5090494853742 },
                        name: '새로운 시작',
                        artist: ['단체전'],
                        date: '2023.01.05 - 2023.02.12',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/goocan_official/'
                    },
                ],
                myeongdong_exhibition_list: [
                    {
                        gallery: '피크닉',
                        introduction: '',
                        place: '서울 중구 퇴계로6가길 30',
                        id: 225473638,
                        coordinate: { longitude: 126.97812314817759, latitude: 37.556958192580645 },
                        name: '국내여행 전시',
                        artist: ['기획전'],
                        date: '2022.10.21 - 2023.02.19',
                        time: '',
                        price: 0,
                        link: 'https://instagram.com/piknic.kr?igshid=YmMyMTA2M2Y='
                    },
                ],
            };
        },
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
                    case 'gangnam':
                        korean = '강남'
                        break
                    case 'yongsan':
                        korean = '용산'
                        break
                    case 'itaewon':
                        korean = '이태원'
                        break
                    case 'jamsil':
                        korean = '잠실'
                        break
                    case 'seongsu':
                        korean = '성수'
                        break
                    case 'seongbuk':
                        korean = '성북'
                        break
                    case 'mapo':
                        korean = '마포'
                        break
                    case 'bukcheon':
                        korean = '북촌'
                        break
                    case 'insadong':
                        korean = '인사동'
                        break
                    case 'pyeongchangdong':
                        korean = '평창동'
                        break
                    case 'gwanghwamun':
                        korean = '광화문'
                        break
                    case 'seochon':
                        korean = '서촌'
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
                    case 'myeongdong':
                        korean = '명동'
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
                this.$refs.drawer.closeDrawer()
                this.$refs.drawer.$el.style.setProperty('bottom', '0')
                // 임시 을지로
                if (true) {
                    let exhibition_list = []

                    if (category === 'uljiro') {
                        exhibition_list = this.uljiro_exhibition_list
                    }
                    else if (category === 'gangnam') {
                        exhibition_list = this.gangnam_exhibition_list
                    }
                    else if (category === 'seongsu') {
                        exhibition_list = this.seongsu_exhibition_list
                    }
                    else if (category === 'munrae') {
                        exhibition_list = this.munrae_exhibition_list
                    }
                    else if (category === 'seongsu') {
                        exhibition_list = this.seongbuk_exhibition_list
                    }
                    // else if (category === 'yongsan') {
                    //     exhibition_list = this.yongsan_exhibition_list
                    // }
                    else if (category === 'jamsil') {
                        exhibition_list = this.jamsil_exhibition_list
                    }
                    else if (category === 'itaewon') {
                        exhibition_list = this.itaewon_exhibition_list
                    }
                    // else if (category === 'seongbuk') {
                    //     exhibition_list = this.seongbuk_exhibition_list
                    // }
                    else if (category === 'mapo') {
                        exhibition_list = this.mapo_exhibition_list
                    }
                    else if (category === 'bukcheon') {
                        exhibition_list = this.bukcheon_exhibition_list
                    }
                    else if (category === 'insadong') {
                        exhibition_list = this.insadong_exhibition_list
                    }
                    else if (category === 'pyeongchangdong') {
                        exhibition_list = this.pyeongchangdong_exhibition_list
                    }
                    // else if (category === 'gwanghwamun') {
                    //     exhibition_list = this.gwanghwamun_exhibition_list
                    // }
                    else if (category === 'seochon') {
                        exhibition_list = this.seochon_exhibition_list
                    }
                    else if (category === 'myeongdong') {
                        exhibition_list = this.myeongdong_exhibition_list
                    }
                    else {
                        exhibition_list = [
                            ...this.uljiro_exhibition_list,
                            ...this.gangnam_exhibition_list,
                            ...this.seongsu_exhibition_list,
                            ...this.munrae_exhibition_list,
                            ...this.seongbuk_exhibition_list,
                            ...this.jamsil_exhibition_list,
                            ...this.itaewon_exhibition_list,
                            ...this.mapo_exhibition_list,
                            ...this.bukcheon_exhibition_list,
                            ...this.insadong_exhibition_list,
                            ...this.pyeongchangdong_exhibition_list,
                            ...this.gwanghwamun_exhibition_list,
                            ...this.seochon_exhibition_list,
                            ...this.myeongdong_exhibition_list
                        ]
                    }

                    let mean_latitude = 0
                    let mean_longitude = 0
                    for (let exhibition of exhibition_list) {
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

                    for (let i = 0; i < exhibition_list.length; i++) {
                        let coordinate = exhibition_list[i].coordinate
                        let latlng = new kakao.maps.LatLng(coordinate.latitude, coordinate.longitude)
                        // LatLngBounds 객체에 좌표 추가
                        bounds.extend(latlng)

                        let marker = new kakao.maps.Marker({
                            map: this.map,
                            position: latlng,
                            title: i.toString(),
                            image: this.marker_image,
                            clickable: true,
                            zIndex: 0
                        })
                        
                        const _this = this
                        kakao.maps.event.addListener(marker, 'click', function () {
                            if (_this.selected_marker === marker) {
                                return
                            }
                            else if (_this.selected_marker !== null) {
                                _this.selected_marker.setImage(_this.marker_image)
                            }

                            for (i of _this.markers) {
                                i.setZIndex(0)
                            }

                            marker.setImage(_this.selected_marker_image)
                            _this.selected_marker = marker
                            _this.selected_marker.setZIndex(1)

                            let title = ''
                            for (let i = 0; i < exhibition_list[marker.getTitle()].artist.length; i++) {
                                title += exhibition_list[marker.getTitle()].artist[i] + ' '
                            }
                            title += ': '
                            title += exhibition_list[marker.getTitle()].name
                            _this.$refs.exhibitionName.innerText = title
                            _this.$refs.exhibitionInformation.innerText = exhibition_list[marker.getTitle()].introduction
                            _this.$refs.exhibitionPlace.innerText = '장소 : ' + exhibition_list[marker.getTitle()].gallery + ' (' + exhibition_list[marker.getTitle()].place + ')'
                            _this.$refs.exhibitionDate.innerText = '기간 : ' + exhibition_list[marker.getTitle()].date
                            _this.$refs.exhibitionTime.innerText = '시간 : ' + exhibition_list[marker.getTitle()].time
                            _this.$refs.exhibitionLink.setAttribute('href', exhibition_list[marker.getTitle()].link)
                            _this.drawer_height = _this.$refs.drawer.$el.clientHeight
                            _this.$refs.drawer.$el.style.setProperty('bottom', `${_this.drawer_height / 3}px`)
                            _this.no_result = false
                        })

                        this.markers.push(marker)
                    }

                    this.map.setBounds(bounds)     
                    return
                }
                // 임시 을지로
                
                /*
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
                */
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
                        title: i.toString(),
                        image: this.marker_image,
                        clickable: true
                    })
                    
                    // const _this = this
                    // kakao.maps.event.addListener(marker, 'click', async function () {
                    //     await _this.clickMarker(marker)
                    // })
                    
                    // 임시 프론트 구간
                    const _this = this
                    kakao.maps.event.addListener(marker, 'click', function () {
                        if (_this.selected_marker === marker) {
                            return
                        }
                        else if (_this.selected_marker !== null) {
                            _this.selected_marker.setImage(_this.marker_image)
                        }

                        for (i of _this.markers) {
                            i.setZIndex(0)
                        }

                        marker.setImage(_this.selected_marker_image)
                        _this.selected_marker = marker
                        _this.selected_marker.setZIndex(1)
                        _this.$refs.exhibitionName.innerText = exhibition_map_object_list[marker.getTitle()].name
                        _this.$refs.exhibitionInformation.innerText = exhibition_map_object_list[marker.getTitle()].introduction
                        _this.$refs.exhibitionDate.innerText = '기간 : ' + exhibition_map_object_list[marker.getTitle()].date
                        _this.$refs.exhibitionTime.innerText = '시간 : ' + exhibition_map_object_list[marker.getTitle()].time
                        _this.$refs.exhibitionPlace.innerText = '장소 : ' + exhibition_map_object_list[marker.getTitle()].place
                        _this.$refs.exhibitionLink.setAttribute('href', exhibition_map_object_list[marker.getTitle()].link)
                        _this.drawer_height = _this.$refs.drawer.$el.clientHeight
                        _this.$refs.drawer.$el.style.setProperty('bottom', `${_this.drawer_height / 3}px`)
                        _this.no_result = false
                    })

                    // 임시 프론트 구간
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
                // 임시 프론트 구간
                    let exhibition_list = [
                        ...this.uljiro_exhibition_list,
                        ...this.seongbuk_exhibition_list,
                        ...this.uljiro_exhibition_list,
                        ...this.seongbuk_exhibition_list,
                        ...this.mapo_exhibition_list,
                        ...this.bukcheon_exhibition_list,
                        ...this.insadong_exhibition_list,
                        ...this.pyeongchangdong_exhibition_list,
                        ...this.gwanghwamun_exhibition_list,
                        ...this.seochon_exhibition_list
                    ]
                    for (let i = 0; i < exhibition_list.length; i++) {
                        let exhibition_name = exhibition_list[i].name
                        while (exhibition_name.includes(' ')) {
                            exhibition_name = exhibition_name.replace(' ', '')
                        }

                        if (exhibition_name.match(new RegExp(keyword_except_blank, "i")) !== null) {
                            let coordinate = exhibition_list[i].coordinate
                            coordinate_sum.latitude += parseFloat(coordinate.latitude)
                            coordinate_sum.longitude += parseFloat(coordinate.longitude)

                            let object = new Object()
                            object.pageId = null
                            object.coordinate = coordinate
                            object.name = exhibition_name
                            object.introduction = exhibition_list[i].introduction
                            object.date = exhibition_list[i].date
                            object.time = exhibition_list[i].time
                            object.place = exhibition_list[i].place
                            object.link = exhibition_list[i].place
                            result_exhibition_object_list.push(object)
                        }
                    }
                // 임시 프론트 구간

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