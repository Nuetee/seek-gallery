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
                category_list: ['\%\%', 'uljiro', 'seongbuk', 'mapo', 'bukcheon', 'insadong', 'pyeongchangdong', 'gwanghwamun', 'seochon'],
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
                        introduction: '공간형에서 열리는 김마저 작가의 전시\n공간 내에 고정된 작품들의 사이를 살피고 그것들을 연결짓는 새로운 읽기 방식을 탐구해보세요',
                        place: '공간형 (서울 중구 을지로 101-2)',
                        id: 598343139,
                        coordinate: { longitude: 126.989550300605, latitude: 37.5664382420232 },
                        name: '《形角無》',
                        artist: ['김마저'],
                        date: '2022.11.5 - 2022.11.20',
                        time: '수-일 13시 ~ 19시 (*월,화 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/artspace_hyeong/'
                    },
                    {
                        gallery: '을지예술센터',
                        introduction : '누군가의 필요에 의해 만들어지는 용도와 누군가의 쓰임에 의해 인정받는 쓸모의 가치를 탐구하는 3부작 중 마지막 전시\n8명의 아티스트가 용접공에서 비건 디자이너까지, 8명의 페르소나를 위해 만든 작품을 만나보세요! ',
                        place : '을지예술센터 (서울 중구 창경궁로5다길 18 3층)',
                        id : 2008866442,
                        coordinate : { longitude: 126.99659065833822, latitude: 37.56773969328135 },
                        name : '《용도의 쓸모 - 사용자 친화적》',
                        artist : ['구수현', '깪', '박소라', '연진영', '이시산', '이윤정', '조효리', '최병석'],
                        date : '2022.11.08 - 2022.12.07',
                        time : '화-일 13시 ~ 20시 (*월 휴무)',
                        link : 'https://www.instagram.com/c.enter_official/'
                    },
                    {
                        gallery : '그블루 갤러리',
                        introduction : '작업을 통해 카메라 뒤편에 대해 이야기하는 윤호진 작가의 전시\n벽 어딘가에 부착된 QR코드 링크도 따라가보세요!',
                        place : '그블루 갤러리 (서울 중구 충무로5길 2 3층)',
                        id : 138252527,
                        coordinate : { longitude: 126.992472989279, latitude: 37.5652131099018 },
                        name : '《[Re]:[Re]:[Re]:[Fw]:》',
                        artist : ['윤호진'],
                        date : '2022.11.9 - 2022.11.27',
                        time : '수-일 13시 ~ 20시 (*월,화 휴무)',
                        price : 0,
                        link : 'https://www.instagram.com/gblue_gallery/'
                    },
                    {
                        gallery : '상업화랑 을지로',
                        introduction : '2년 반의 펜데믹 기간이 지나고 다시 일상으로 복귀해가고 있는 시점에서, ‘거주’와 ‘집’의 의미를 되새기는 전시\n상업화랑 용산에서도 동일한 전시를 즐길 수 있다고 합니다!',
                        place : '상업화랑 을지로 (서울 중구 을지로 143 4층)',
                        id : 1511830976,
                        coordinate : { longitude: 126.99394205418, latitude: 37.5666583920689 },
                        name : '<<가택연금>>',
                        artist : ['강홍구', '노충현', '박진영', '서동욱', '안경수', '옥정호', '윤정미', '정성진', '정용국', '정재호', '최선', '최현숙'],
                        date : '2022.11.5 - 2022.12.4',
                        time : '화-금 13시 ~ 19시, 토-일 13시 ~ 18시 (*월 휴무)',
                        price : 0,
                        link : 'https://www.instagram.com/sahngupgallery/'
                    },
                    {
                        gallery : '햇빛담요재단',
                        introduction : '리투아니아 루벤아트파운데이션에 소장된 젊은 작가들의 작품을 마주할 수 있는 전시\n발트 지역의 신선한 예술적 시각과 통찰을 경험해보세요!',
                        place : '햇빛담요재단 (서울 중구 을지로 95)',
                        id : 1546954217,
                        coordinate : { longitude: 126.98849991280093, latitude: 37.56633903482297 },
                        name : '⟪루벤 아트파운데이션 소장품전⟫',
                        artist : [],
                        date : '2022.9.16 - 2022.11.26',
                        time : '화-토 11시 ~ 18시 반 (*일,월 휴무)',
                        price : 0,
                        link : 'https://instagram.com/sunblanketfoundation?igshid=YmMyMTA2M2Y='
                    }
                ],
                seongbuk_exhibition_list: [
                    {
                        gallery: '챔버1965',
                        introduction: '2년 반의 펜데믹 기간이 지나고 다시 일상으로 복귀해가고 있는 시점에서, ‘거주’와 ‘집’의 의미를 되새기는 전시\n을지로 상업화랑과 함께하는 전시입니다!',
                        place: '챔버1965 (서울 성북구 동소문로 26-6)',
                        id: 1511830976,
                        coordinate: { longitude: 127.009035327874, latitude: 37.5893416315225 },
                        name: '<<가택연금>>',
                        artist: ['강홍구', '노충현', '박진영', '서동욱', '안경수', '옥정호', '윤정미', '정성진', '정용국', '정재호', '최선', '최현숙'],
                        date: '2022.11.5 - 2022.12.4',
                        time: '화-금 13시 ~ 19시, 토-일 13시 ~ 18시 (*월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/chamber1965/'
                    },
                    {
                        gallery: '웨스',
                        introduction: '‘방언’이 공공의 언어와 공명하며 동시대와 맺는 관계에 주목하는 전시\n1층 입구에서<동행자 스마트 워크맨>의 음성 안내를 들으며 전시장에 들어가보세요!',
                        place: '웨스 (서울 성북구 창경궁로 320 2층)',
                        id: 680706599,
                        coordinate: { longitude: 127.005117652004, latitude: 37.5878426147537 },
                        name: '《바위와 가장자리》',
                        artist: [],
                        date: '2022.11.5 - 2022.12.2',
                        time: '목-일 13시 ~ 17시 (*월,화,수 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/wess.seoul/'
                    },
                    {
                        gallery: '00의00',
                        introduction: '00의00에서 열리는 사진 설치와 관련한 전시\n홍익대학교 시각디자인과 사진예술 소모임 HIPS가 사진이라는 매체를 바라보는 방식을 엿보세요.',
                        place: '00의00 (서울 성북구 성북로 2길 8)',
                        id: 849604574,
                        coordinate: { longitude: 127.006374519181, latitude: 37.5889994280658 },
                        name: '《사진-설치》',
                        artist: [],
                        date: '2022.11.22 - 2022.12.4',
                        time: '수-일 13시 ~ 19시',
                        price: 0,
                        link: 'https://www.instagram.com/00.00.seoul/'
                    },
                    {
                        gallery: '오트',
                        introduction: '카와카마 요시로 작가의 한국 최초로 열리는 개인전\n어른이 되어서도 애니메이션을 보듯이, 소년의 모습 그대로 늙어감을 표현한 회화 작업들을 만나보세요!',
                        place: '오트 서울 (서울 성북구 성북로 91)',
                        id: 460538035,
                        coordinate: { longitude: 126.998695589765, latitude: 37.5929026912513 },
                        name: '《Dear Ambivalence》',
                        artist: ['카와카마 요시로'],
                        date: '2022.10.27 - 2022.12.4',
                        time: '수-일 13시 반 ~ 18시 (*월,화 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/aughtpress/'
                    },
                    {
                        gallery: 'BB&M',
                        introduction: "우정수 작가의 자기애적 감수성의 흥미로운 이면들을 '나르키소스 신화'의 상징적 이미지로 표현한 전시\n고전 회화 속 신화의 장면들을 특유의 감각과 시점으로 재조합한 작품들을 마주하실 수 있습니다.",
                        place: 'BB&M (서울 성북구 성북로23길 10)',
                        id: 1386203123,
                        coordinate: { longitude: 126.99538924259, latitude: 37.5933819360811 },
                        name: '《Palindrome》',
                        artist: ['우정수'],
                        date: '2022.11.5 - 2022.12.17',
                        time: '화-토 11시 ~ 18시 (*일,월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/gallerybbm/'
                    },
                    {
                        gallery: '성북구립미술관',
                        introduction: "평생 ‘인체’를 화두로, ‘인간’과 ‘조각’의 본질을 탐구한 조각가 정현의 30년 여정을 총 망라한 전시\n매일 오전 11시에는 전시해설도 진행됩니다.",
                        place: '성북구립미술관 (서울 성북구 성북로 134)',
                        id: 12293765,
                        coordinate: { longitude: 126.994886397801, latitude: 37.5948451259332 },
                        name: '《시간의 초상》',
                        artist: ['정현'],
                        date: '2022.10.5 - 2022.12.4',
                        time: '화-일 10시 ~ 18시 (*월 휴무)',
                        price: 0,
                        link: 'https://www.instagram.com/seongbukmuseum/'
                    }
                ],
                mapo_exhibition_list: [
                    {
                        gallery: '온수공간',
                        introduction: '',
                        place: '서울 마포구 월드컵북로1길 74',
                        id: 1993482544,
                        coordinate: { longitude: 126.917815663776, latitude: 37.5534898065016 },
                        name: '《소리, 입자, 열매가 된 사람》,《Post-it All and Stick Them》',
                        artist: [],
                        date: '2022.11.19 - 2022.12.10',
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
                        name: '《Blow-up⟫',
                        artist: ['신선우'],
                        date: '2022.11.16 - 2022.12.4',
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
                        id: 1883808062,
                        coordinate: { longitude: 126.93175954697332, latitude: 37.576888544485584 },
                        name: '',
                        artist: [],
                        date: '2022.11.19 - 2022.12.10',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/placemak/'
                    },
                    {
                        gallery: '합정지구',
                        introduction: '',
                        place: '서울 마포구 월드컵로 40',
                        id: 1422884483,
                        coordinate: { longitude: 126.912465702581, latitude: 37.5528624711019 },
                        name: '《대면》',
                        artist: ['이문주'],
                        date: '2022.11.18 - 2022.12.18',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/hapjungjigu/'
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
                        name: '',
                        artist: [],
                        date: '',
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
                        gallery: '스페이스소',
                        introduction: '',
                        place: '서울 마포구 동교로17길 37',
                        id: 1235106546,
                        coordinate: { longitude: 126.915091611529, latitude: 37.5565188344795 },
                        name: '⟪5 FIVE⟫ Vol. II',
                        artist: [],
                        date: '2022.11.10 - 2022.12.11',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/space__so/'
                    },
                    {
                        gallery: '예술공간 의식주',
                        introduction: '',
                        place: '서울 마포구 월드컵로16길 52-19',
                        id: 1358490354,
                        coordinate: { longitude: 126.91280961182888, latitude: 37.55685594631827 },
                        name: '⟪서사의 현장⟫',
                        artist: [],
                        date: '2022.11.22 - 2022.12.4',
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
                        gallery: '갤러리진선',
                        introduction: '',
                        place: '서울 종로구 삼청로 59 2층',
                        id: 26786624,
                        coordinate: { longitude: 126.98046856127404, latitude: 37.5813827907419 },
                        name: '⟪숲⟫',
                        artist: ['전영근'],
                        date: '2022.11.23 - 2022.12.11',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/galleryjinsun/'
                    },
                    {
                        gallery: '킵인터치',
                        introduction: '',
                        place: '서울 종로구 북촌로1길 13',
                        id: 2108894844,
                        coordinate: { longitude: 126.984948070912, latitude: 37.5773145581055 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/p/Ck-U3UPpBuA/'
                    },
                    {
                        gallery: 'PKM갤러리',
                        introduction: '',
                        place: '서울 종로구 삼청로7길 40',
                        id: 1542000520,
                        coordinate: { longitude: 126.980073858136, latitude: 37.5840965170627 },
                        name: '',
                        artist: [],
                        date: '',
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
                        name: '',
                        artist: [],
                        date: '',
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
                        date: '2022.11.24 - 2023.1.28',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/museumhead_/'
                    },
                    {
                        gallery: '이목화랑',
                        introduction: '',
                        place: '서울 종로구 북촌로 94',
                        id: 8041993,
                        coordinate: { longitude: 126.98544011616, latitude: 37.5851965126104 },
                        name: '⟪투명한 두께⟫',
                        artist: ['나빈'],
                        date: '2022.11.25 - 2022.12.16',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/yeemockgallery/'
                    },
                    {
                        gallery: '갤러리마롱',
                        introduction: '',
                        place: '서울 종로구 북촌로 143-6',
                        id: 1991374057,
                        coordinate: { longitude: 126.982736026845, latitude: 37.587077421354 },
                        name: '⟪THE GIFT⟫',
                        artist: [],
                        date: '2022.11.30 - 2022.12.11',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/gallery_marron/'
                    }
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
                    {
                        gallery: '프로젝트 스페이스 미음',
                        introduction: '',
                        place: '서울 종로구 평창20길 14',
                        id: 816509385,
                        coordinate: { longitude: 126.972230159526, latitude: 37.6085928874806 },
                        name: '《NJOKOBOK / YOU ARE WELCOME: WE SHARE IT》',
                        artist: ['아폴로니아 슈시테르쉬치'],
                        date: '2022.11.18 - 2022.12.15',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/projectspacemium/'
                    }
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
                        gallery: '보안1942',
                        introduction: '',
                        place: '서울 종로구 효자로 33',
                        id: 14562864,
                        coordinate: { longitude: 126.97362679381301, latitude: 37.57910825301889 },
                        name: '《스틸라이프 인 드림드림드림》',
                        artist: ['구나'],
                        date: '2022.11.26 - 2022.12.18',
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
                        name: '',
                        artist: [],
                        date: '',
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
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/pssarubia/'
                    },
                    {
                        gallery: '갤러리 아트사이드',
                        introduction: '',
                        place: '서울 종로구 자하문로6길 15',
                        id: 8428388,
                        coordinate: { longitude: 126.97294784304906, latitude: 37.578267471918814 },
                        name: '',
                        artist: [],
                        date: '2022.12.2 - 2022.12.31',
                        time: '',
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
                        introduction: '',
                        place: '서울 종로구 자하문로5길 28',
                        id: 136380522,
                        coordinate: { longitude: 126.970312542225, latitude: 37.5778172425068 },
                        name: '',
                        artist: [],
                        date: '',
                        time: '',
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
                        gallery: '표갤러리',
                        introduction: '',
                        place: '서울 종로구 자하문로5길 18-4',
                        id: 8129692,
                        coordinate: { longitude: 126.97082873644398, latitude: 37.57789575768786 },
                        name: '⟪HIT THE ROAD⟫',
                        artist: ['하정우'],
                        date: '2022.11.17 - 2022.12.19',
                        time: '',
                        price: 0,
                        link: 'https://www.instagram.com/pyogallery/'
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
            this.selected_category_index = 2
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