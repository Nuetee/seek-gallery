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
                category_list: ['\%\%', 'uljiro', 'itaewon', 'mapo', 'bukcheon', 'insadong', 'pyeongchangdong', 'gwanghwamun', 'seochon'],
                selected_category_index: 0,
                markers: [],
                selected_marker: null,
                marker_image: null,
                selected_marker_image: null,
                keyword: '',
                no_result: false,
                no_exhibition: false,

                // 임시 프론트
                uljiro_exhibition_list: [
                    {
                        gallery: '공간형',
                        introduction: '',
                        place: '공간형 (서울 중구 을지로 101-2)',
                        id: 598343139,
                        coordinate: { longitude: 126.989550300605, latitude: 37.5664382420232 },
                        name: '《HIT AND RUN》',
                        artist: ['이천국'],
                        date: '2022.12.15 - 2023.01.01',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/artspace_hyeong/'
                    },
                    {
                        gallery: '카다로그',
                        introduction: '',
                        place: '서울 중구 수표로 58-1 3층',
                        id: 1685332359,
                        coordinate: { longitude: 126.98984685591486, latitude: 37.56645628781836 },
                        name: '《Double Weave》',
                        artist: ['윤미류'],
                        date: '2022.12.09 - 2022.12.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/cadalogs_space/'
                    },
                    {
                        gallery: 'N/A',
                        introduction: '',
                        place: '서울 중구 창경궁로 27 2층',
                        id: 605769297,
                        coordinate: { longitude: 126.996418647635, latitude: 37.5668819401587 },
                        name: '《Memory of Rib》',
                        artist: ['N/A 기획전'],
                        date: '2022.11.25 - 2023.01.04',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/nslasha.kr/'
                    },
                    {
                        gallery: '더 소소',
                        introduction: '',
                        place: '서울 중구 청계천로 172-1 4층',
                        id: 1331538439,
                        coordinate: { longitude: 126.996880000000, latitude: 37.5683848128985 },
                        name: '《야간행 Nocturama》',
                        artist: ['권도연'],
                        date: '2022.12.03 - 2022.12.30',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/55ooofff/'
                    },
                    {
                        gallery: '더 소소',
                        introduction: '',
                        place: '서울 중구 청계천로 172-1 5층',
                        id: 1331538439,
                        coordinate: { longitude: 126.996820000000, latitude: 37.5683848128985 },
                        name: '《언제나 이미 거기에》',
                        artist: ['권도연'],
                        date: '2022.12.03 - 2022.12.30',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/55ooofff/'
                    },
                    {
                        gallery: '디휘테 갤러리',
                        introduction: '',
                        place: '서울 중구 마른내로12길 7-11',
                        id: 295684680,
                        coordinate: { longitude: 127.00105263618534, latitude: 37.56425828915283 },
                        name: '《을지연가》',
                        artist: ['송구영신 기획전'],
                        date: '2022.12.15 - 2023.01.20',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery_huette/'
                    },
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
                ],
                seongbuk_exhibition_list: [
                ],
                itaewon_exhibition_list: [
                    {
                        gallery: '뉴스프링프로젝트',
                        introduction: '',
                        place: '용산구 이태원로 45길 22',
                        id: 290171398,
                        coordinate: { longitude: 126.99841936898042, latitude: 37.53646698690474 },
                        name: '《나의 우주다》',
                        artist: ['조선희'],
                        date: '2022.12.20 - 2023.01.05',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/p/Ci6uFsGJMcF/'
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
                        gallery: '온수공간',
                        introduction: '',
                        place: '서울 마포구 월드컵북로1길 74',
                        id: 1993482544,
                        coordinate: { longitude: 126.917815663776, latitude: 37.5534898065016 },
                        name: '《Peer to Peer》',
                        artist: ['단체전'],
                        date: '2022.12.15 - 2022.12.31',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/os_gonggan/'
                    },
                    {
                        gallery: '플레이스막1',
                        introduction: '',
                        place: '서울 마포구 성미산로 198 동진시장 내',
                        id: 302728748,
                        coordinate: { longitude: 126.926736155754, latitude: 37.5623254498867 },
                        name: '《손끝의 말》',
                        artist: ['그룹전'],
                        date: '2022.12.11 - 2022.12.30',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/placemak/'
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
                        gallery: '플레이스막3',
                        introduction: '',
                        place: '서울 서대문구 홍연길 96 지하 1층',
                        www스페이스d: 1883808062,
                        coordinate: { longitude: 126.93175954697332, latitude: 37.576888544485584 },
                        name: '《연결된 마디》',
                        artist: ['박소영'],
                        date: '2022.12.07 - 2023.01.05',
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
                        name: '⟪긍정적 우울⟫',
                        artist: ['김진형'],
                        date: '2022.11.23 - 2022.12.4',
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
                    {
                        gallery: '예술공간 의식주',
                        introduction: '',
                        place: '서울 마포구 월드컵로16길 52-19',
                        id: 1358490354,
                        coordinate: { longitude: 126.91280961182888, latitude: 37.55685594631827 },
                        name: '《끝과 시작을 위한 소인》',
                        artist: ['김다혜', '민지훈'],
                        date: '2022.12.13 - 2022.12.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/the_necessaries/'
                    },
                ],
                bukcheon_exhibition_list: [
                    {
                        gallery: '아트비앤',
                        introduction: '',
                        place: '서울 종로구 삼청로 22-31 2층',
                        id: 1664494795,
                        coordinate: { longitude: 126.980505718632, latitude: 37.577818464872 },
                        name: '⟪경계-사이의 풍경⟫',
                        artist: [],
                        date: '2022.11.29 - 2022.12.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery_artbn/'
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
                        gallery: '킵인터치',
                        introduction: '',
                        place: '서울 종로구 북촌로1길 13',
                        id: 2108894844,
                        coordinate: { longitude: 126.984948070912, latitude: 37.5773145581055 },
                        name: 'Dark Closet',
                        artist: ['박소라'],
                        date: '2022.12.21 - 2023.01.01',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/keep_in_touch_seoul/'
                    },
                    {
                        gallery: 'PKM갤러리',
                        introduction: '',
                        place: '서울 종로구 삼청로7길 40',
                        id: 1542000520,
                        coordinate: { longitude: 126.980073858136, latitude: 37.5840965170627 },
                        name: 'on paper',
                        artist: ['PKM 단체전'],
                        date: '2022.12.07 - 2023.01.07',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/pkmgallery/'
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
                    {
                        gallery: '학고재 Space 1',
                        introduction: '',
                        place: '서울 종로구 삼청로 50',
                        id: 10944712,
                        coordinate: { longitude: 126.98031709785579, latitude: 37.58046555396314 },
                        name: '⟪캐피탈 블랙⟫',
                        artist: ['최원준'],
                        date: '2022.11.30 - 2023.01.14',
                        time: '',
                        price: 0,
                        link: ''
                    },
                    {
                        gallery: '페로탕 삼청',
                        introduction: '',
                        place: '서울 종로구 팔판길 5',
                        id: 626791454,
                        coordinate: { longitude: 126.98057247525081, latitude: 37.58231263327712 },
                        name: '⟪A Canker in the Leaf⟫',
                        artist: ['매튜 로네이'],
                        date: '2022.11.24 - 2023.01.14',
                        time: '',
                        price: 0,
                        link: ''
                    },
                ],
                insadong_exhibition_list: [
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
                    {
                        gallery: '일민미술관',
                        introduction: '',
                        place: '서울 종로구 세종대로 152',
                        id: 11179476,
                        coordinate: { longitude: 126.977637157186, latitude: 37.5698819940064 },
                        name: '《다시 그린 세계: 한국화의 단절과 연속》',
                        artist: [],
                        date: '2022.10.28 - 2023.1.8',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/ilminmuseumofart/'
                    },
                ],
                seochon_exhibition_list: [
                    {
                        gallery: '아트스페이스 보안 1 ',
                        introduction: '불안한 그림을 통해 인간의 감정을 표현하는 김지은 작가의 개인전\n불안한 생각으로부터 머리를 비우고 내가 할 수 있는만큼 나아가기를 바라는 작가의 기획을 느껴보세요.',
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
                        gallery: '아트스페이스 보안 3',
                        introduction: '구나 작가의 강박과 모순적 태도를 거쳐 태어난 희미하지만 질긴 형상의 조각들을 찬찬히 살펴보세요!',
                        place: '서울 종로구 효자로 33 보안1942 지하 2층',
                        id: 14562864,
                        coordinate: { longitude: 126.97357000000000, latitude: 37.57910000000000 },
                        name: '《NEW LIGHT》',
                        artist: ['신준민'],
                        date: '2022.12.07 - 2022.12.29',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/boan1942/'
                    },
                    {
                        gallery: '팩토리2',
                        introduction: '',
                        place: '서울 종로구 자하문로10길 15',
                        id: 12983379,
                        coordinate: { longitude: 126.972413039149, latitude: 37.5795215318413 },
                        name: 'MYRIAD',
                        artist: ['Renata Schirm'],
                        date: '2022.12.16 - 2023.01.07',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/factory2.seoul/'
                    },
                    {
                        gallery: '프로젝트 스페이스 사루비아',
                        introduction: '',
                        place: '서울 종로구 자하문로16길 4 지하',
                        id: 25051286,
                        coordinate: { longitude: 126.97142624584727, latitude: 37.581447621821 },
                        name: '진희',
                        artist: ['노혜리'],
                        date: '2022.12.14 - 2023.01.15',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/pssarubia/'
                    },
                    {
                        gallery: '갤러리 아트사이드',
                        introduction: '일상 속에 예술이 스며들기 바라는 마음을 담아 다양한 장르의 작품을 선보이는 그룹전\n시각예술을 좀 더 쉽고 흥미롭게 즐겨보세요!',
                        place: '아트사이드 B1 서울 종로구 자하문로6길 15',
                        id: 8428388,
                        coordinate: { longitude: 126.97290000000000, latitude: 37.578260000000000 },
                        name: '《New Memories in Holiday》',
                        artist: [], 
                        date: '2022.12.2 - 2022.12.31',
                        time: '화-토 10시 ~ 18시 (*일,월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/artsidegallery_/'
                    },
                    {
                        gallery: '갤러리 아트사이드',
                        introduction: '판화와 회화를 자연스럽게 넘나들며 그만의 따뜻하고 포근한 분위기를 보여주는 임수진 작가의 개인전\n겨울과 관련한 일상적인 풍경과 사물에서 따스함을 발견해보세요:)',
                        place: '아트사이드 1F 서울 종로구 자하문로6길 15',
                        id: 8428388,
                        coordinate: { longitude: 126.97296004304906, latitude: 37.578267471918814 },
                        name: '《설공》',
                        artist: ['임수진'],
                        date: '2022.12.2 - 2022.12.31',
                        time: '화-토 10시 ~ 18시 (*일,월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/artsidegallery_/'
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
                        gallery: 'tya 서촌',
                        introduction: '2022년 1년간 tya 서촌을 빛내준 작가님들께 감사의 마음을 전하는 기획전\n추운 겨울에 진행되지만, 마음만큼은 따뜻한 전시를 느껴보세요!',
                        place: 'TYA 서촌 (서울 종로구 자하문로5길 28)',
                        id: 136380522,
                        coordinate: { longitude: 126.970312542225, latitude: 37.5778172425068 },
                        name: '⟪Thank You All⟫',
                        artist: [],
                        date: '2022.12.02 - 2022.12.31',
                        time: '월-일 13시 ~ 19시',
                        price: 0,
                        link: 'https://www.instagram.com/yeemockgallery/'
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
                ]
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
                    case 'itaewon':
                        korean = '이태원'
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
                    else if (category === 'itaewon') {
                        exhibition_list = this.itaewon_exhibition_list
                    }
                    else if (category === 'seongbuk') {
                        exhibition_list = this.seongbuk_exhibition_list
                    }
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
                    else if (category === 'gwanghwamun') {
                        exhibition_list = this.gwanghwamun_exhibition_list
                    }
                    else if (category === 'seochon') {
                        exhibition_list = this.seochon_exhibition_list
                    }
                    else {
                        exhibition_list = [
                            ...this.uljiro_exhibition_list,
                            ...this.seongbuk_exhibition_list,
                            ...this.mapo_exhibition_list,
                            ...this.bukcheon_exhibition_list,
                            ...this.insadong_exhibition_list,
                            ...this.pyeongchangdong_exhibition_list,
                            ...this.gwanghwamun_exhibition_list,
                            ...this.seochon_exhibition_list
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
                            _this.$refs.exhibitionName.innerText = exhibition_list[marker.getTitle()].name
                            _this.$refs.exhibitionInformation.innerText = exhibition_list[marker.getTitle()].introduction
                            _this.$refs.exhibitionDate.innerText = '기간 : ' + exhibition_list[marker.getTitle()].date
                            _this.$refs.exhibitionTime.innerText = '시간 : ' + exhibition_list[marker.getTitle()].time
                            _this.$refs.exhibitionPlace.innerText = '장소 : ' + exhibition_list[marker.getTitle()].place
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