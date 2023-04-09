<template>
  <div id="mapPage">
    <div class="fixedContainer">
      <div class="header">
        <div class="top">
          <div class="left">
            <img
              src="../assets/seek_logo.png"
              @click="
                () => {
                  this.$router.push({ path: '/' });
                }
              "
            />
          </div>
          <div class="right">
            <div class="poppins">About Us</div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div class="bottom">지금 열리고 있는 전시를 확인해 보세요!</div>
      </div>
      <div class="categoryContainer">
        <div
          :class="[
            'category' + i,
            { selected: i === this.selected_category_index },
          ]"
          v-for="(category, i) in this.category_list"
          @click="
            async () => {
              await this.selectCategory(category, i);
            }
          "
        >
          {{ this.convetString(category) }}
        </div>
      </div>
    </div>
    <div id="map"></div>
    <Drawer :class_name="'exhibition'" ref="drawer">
      <template v-slot:default>
        <div class="exhibitionName" ref="exhibitionName"></div>
        <div class="exhibitionDate" ref="exhibitionDate"></div>
        <div class="exhibitionInformation" ref="exhibitionInformation"></div>
        <div class="exhibitionPlace">
          <div class="title">상세주소</div>
          <div class="content" ref="exhibitionPlace"></div>
        </div>
        <div class="exhibitionTime">
          <div class="title">시간</div>
          <div class="content" ref="exhibitionTime"></div>
        </div>
        <div class="exhibitionFee">
          <div class="title">가격</div>
          <div class="content" ref="exhibitionFee"></div>
        </div>
        <a class="exhibitionLink" ref="exhibitionLink" target="_blank"
          >둘러보기</a
        >
      </template>
    </Drawer>
  </div>
</template>
<script>
import MainHeader from "@/widgets/MainHeader.vue";
import Drawer from "@/widgets/Drawer.vue";
import { Exhibition } from "@/classes/exhibition";

export default {
  name: "MapPage",
  components: {
    MainHeader,
    Drawer,
  },
  data() {
    return {
      map: null,
      category_list: [
        "\%\%",
        "uljiro",
        "mapo",
        "seochon",
        "bukcheon",
        "jamsil",
        "seongsu",
        "gangnam",
        // "seongbuk",
        "itaewon",
        "insadong",
        "myeongdong",
        "pyeongchangdong",
        // "cityhall",
        // "yaksu",
        "yongsan",
        "yeouido",
        "jongro"
      ],
      selected_category_index: 0,
      markers: [],
      selected_marker: null,
      marker_image: null,
      selected_marker_image: null,
      keyword: "",
      no_result: false,
      no_exhibition: false,

      // 임시 프론트
      jamsil_exhibition_list: [
        // {
        //   gallery: "소마미술관",
        //   introduction: "",
        //   place: "서울 송파구 위례성대로 51 2관",
        //   id: 12443890,
        //   coordinate: { longitude: 127.1180061737, latitude: 37.51688603716 },
        //   name: "《뒤뷔페 전》",
        //   artist: ["기획전"],
        //   date: "2022.10.01 - 2023.02.05",
        //   time: "",
        //   price: 20000,
        //   link: "https://instagram.com/soma_museum?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "롯데갤러리 잠실",
          introduction: "",
          place: "서울 송파구 올림픽로 300 롯데월드타워 6층",
          id: 1398479164,
          coordinate: { longitude: 127.1025, latitude: 37.5126405126229 },
          name: "《고요의 순간》",
          artist: ["Alfie Caine"],
          date: "2022.12.09 - 2023.02.19",
          time: "",
          price: 0,
          link: "https://instagram.com/lottegallery_official?igshid=YmMyMTA2M2Y=",
        },
        // {
        //   gallery: "롯데뮤지엄",
        //   introduction: "",
        //   place: "서울 송파구 올림픽로 300 롯데월드타워 7층",
        //   id: 1398479164,
        //   coordinate: { longitude: 127.1026, latitude: 37.5126405126229 },
        //   name: "",
        //   artist: ["Martin Margiela"],
        //   date: "2022.12.24 - 2023.03.26",
        //   time: "",
        //   price: 19000,
        //   link: "https://instagram.com/lottemuseum?igshid=YmMyMTA2M2Y=",
        // },
      ],
      seongsu_exhibition_list: [
        {
          gallery: "에스팩토리",
          introduction: "",
          place:
            "성동구 성수동2가 273-13",
          id: 1891570540,
          coordinate: {
            longitude: 127.059573316959,
            latitude: 37.5426445439481,
          },
          name: "《더프리뷰 성수》",
          artist: ["단체전"],
          date: "2023.04.20 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/thepreviewartfair/",
        },
        {
          gallery: "갤러리 구조",
          introduction: "",
          place: "서울 성동구 뚝섬로 419 4층",
          id: 1115846968,
          coordinate: {
            longitude: 127.057273016109,
            latitude: 37.5383632299041,
          },
          name: "《Divine Weight》",
          artist: ["단체전"],
          date: "2023.03.16 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://instagram.com/gallerykuzo?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "그라운드시소 성수",
          introduction: "",
          place:
            "서울특별시 성동구 아차산로17길 49 생각공장 데시앙플렉스 지하 1층",
          id: 290027091,
          coordinate: {
            longitude: 127.065279873384,
            latitude: 37.5467681032114,
          },
          name: "《나탈리 카르푸셴코 사진전》",
          artist: ["기획전"],
          date: "2022.12.23 - 2023.05.07",
          time: "",
          price: 15000,
          link: "",
        },
        // {
        //     gallery: 'PFS 갤러리',
        //     introduction: '',
        //     place: '서울 성동구 왕십리로6길 4-8 1층',
        //     id: 2064925301,
        //     coordinate: { longitude: 127.0451074128326, latitude: 37.5459 },
        //     name: '《COLORS AND THE LIGHT》',
        //     artist: ['이아람'],
        //     date: '2022.12.30 - 2023.01.29',
        //     time: '',
        //     price: 0,
        //     link: 'https://instagram.com/pfs_gallery?igshid=YmMyMTA2M2Y='
        // },
        // {
        //     gallery: 'PFS 갤러리',
        //     introduction: '',
        //     place: '서울 성동구 왕십리로6길 4-8 1층',
        //     id: 2064925301,
        //     coordinate: { longitude: 127.0451074128326, latitude: 37.54585 },
        //     name: '《이불전》',
        //     artist: ['이강'],
        //     date: '2022.12.30 - 2023.01.29',
        //     time: '',
        //     price: 0,
        //     link: 'https://instagram.com/pfs_gallery?igshid=YmMyMTA2M2Y='
        // },
        // {
        //   gallery: "스타트플러스",
        //   introduction: "",
        //   place: "서울 성동구 왕십리로 76",
        //   id: 778461860,
        //   coordinate: {
        //     longitude: 127.045099686985,
        //     latitude: 37.544352045605,
        //   },
        //   name: "《London X Seoul, The art of neon》",
        //   artist: ["마크슬로퍼"],
        //   date: "2023.02.23 - 2023.03.12",
        //   time: "",
        //   price: 8000,
        //   link: "https://instagram.com/start.art.seoul?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "CDA 갤러리",
          introduction: "",
          place: "서울 성동구 성수일로10가길 4 지하1층",
          id: 302480245,
          coordinate: {
            longitude: 127.051964033802,
            latitude: 37.5480000722261,
          },
          name: "《FROM THE MASS》",
          artist: ["콰야"],
          date: "2023.01.20 - 2023.02.11",
          time: "",
          price: 0,
          link: "https://instagram.com/cdagallery.kr?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "앵포르멜",
          introduction: "",
          place: "서울 성동구 연무장길 28-8 트라이베카 빌딩 2층",
          id: 1816643875,
          coordinate: {
            longitude: 127.052401954978,
            latitude: 37.5431272757837,
          },
          name: "《IN MY ROOM》",
          artist: ["스테레오그램"],
          date: "2023.01.17 - 2023.02.11",
          time: "",
          price: 0,
          link: "https://instagram.com/informel_official?igshid=YmMyMTA2M2Y=",
        },
        // {
        //     gallery: '다이브인 성수',
        //     introduction: '',
        //     place: '서울 성동구 아차산로13길 31 2층',
        //     id: 841541749,
        //     coordinate: { longitude: 127.061523350619, latitude: 37.5458736262864 },
        //     name: '《SURF》',
        //     artist: ['다니엘 신'],
        //     date: '2023.01.06 - 2023.01.28',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/divein_seoul/'
        // },
        // {
        //   gallery: "틸테이블",
        //   introduction: "",
        //   place: "서울 성동구 아차산로 120 1층",
        //   id: 14866998,
        //   coordinate: {
        //     longitude: 127.05724845084552,
        //     latitude: 37.543970793728704,
        //   },
        //   name: "《LO&FRECKLES FOREST》",
        //   artist: ["이슬로"],
        //   date: "2023.01.12 - 2023.02.23",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/tealtable__official?igshid=YmMyMTA2M2Y=",
        // },
      ],
      uljiro_exhibition_list: [
        {
          gallery: "d/p",
          introduction: "",
          place: "서울 종로구 삼일대로 428 낙원상가 417호",
          id: 201548590,
          coordinate: {
            longitude: 126.987898967415,
            latitude: 37.5727630725455,
          },
          name: "love-in",
          artist: ["단체전"],
          date: "2023.03.21 - 2023.04.22",
          time: "",
          price: 0,
          link: "https://instagram.com/dslashp?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "에브리아트",
          introduction: "",
          place: "서울 중구 동호로 353 4층",
          id: 1716462681,
          coordinate: {
            longitude: 127.00199213175,
            latitude: 37.5659881896749,
          },
          name: "《낭만(浪漫)에 대하여》",
          artist: ["주지오"],
          date: "2023.04.07 - 2023.04.28",
          time: "",
          price: 0,
          link: "https://www.instagram.com/p/CkF14rSJZ-c/",
        },
        // {
        //   gallery: "포켓테일즈",
        //   introduction: "",
        //   place: "서울 중구 을지로 157 대림상가 961호",
        //   id: 1930616622,
        //   coordinate: {
        //     longitude: 126.99545085147135,
        //     latitude: 37.56714589862522,
        //   },
        //   name: "《조각의 조각》",
        //   artist: ["유리"],
        //   date: "2023.03.14 - 2023.04.01",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/pokettales?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "스페이스유닛4",
        //   introduction: "",
        //   place: "서울 중구 을지로 143 4층",
        //   id: 1511830976,
        //   coordinate: {
        //     longitude: 126.99394205418,
        //     latitude: 37.5666583920689,
        //   },
        //   name: "《내 안의 정육점에 어서 오세요》",
        //   artist: ["장오제"],
        //   date: "2023.03.08 - 2023.04.02",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/spaceunit4/",
        // },
        // {
        //   gallery: "더 소소",
        //   introduction: "",
        //   place: "서울 중구 청계천로 172-1 4층",
        //   id: 1331538439,
        //   coordinate: {
        //     longitude: 126.996830597947,
        //     latitude: 37.5683848128985,
        //   },
        //   name: "《나의 회화적 순간》",
        //   artist: ["단체전"],
        //   date: "2023.03.10 - 2023.04.07",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallerysoso_/",
        // },
        // {
        //   gallery: "을지로OF",
        //   introduction: "",
        //   place: "서울 중구 창경궁로5길 31 3층",
        //   id: 1555038746,
        //   coordinate: {
        //     longitude: 126.99625338742652,
        //     latitude: 37.566918875861425,
        //   },
        //   name: "《해랑》",
        //   artist: ["MYO", "손슬기", "이원우"],
        //   date: "2023.03.11 - 2023.04.02",
        //   time: "오후 1시부터 7시까지, 월 화 휴관",
        //   price: 0,
        //   link: "https://www.instagram.com/55ooofff/",
        // },
        {
          gallery: "을지예술센터",
          introduction: "",
          place: "서울 중구 창경궁로5다길 18 3층",
          id: 2008866442,
          coordinate: {
            longitude: 126.99659065833822,
            latitude: 37.56773969328135,
          },
          name: "《Dear My Cake》",
          artist: ["이페로"],
          date: "2023.03.27 - 2023.04.14",
          time: "",
          price: 0,
          link: "https://www.instagram.com/c.enter_official/",
        },
        {
          gallery: "N/A",
          introduction: "",
          place: "서울 중구 창경궁로 27 2층",
          id: 605769297,
          coordinate: {
            longitude: 126.996418647635,
            latitude: 37.5668819401587,
          },
          name: "《There's no one》",
          artist: ["Less"],
          date: "2023.03.18 - 2023.04.16",
          time: "",
          price: 0,
          link: "https://www.instagram.com/nslasha.kr/",
        },
        // {
        //   gallery: "상업화랑 을지로",
        //   introduction: "",
        //   place: "서울 중구 을지로 143 4층 1-1호",
        //   id: 1511830976,
        //   coordinate: {
        //     longitude: 126.99394205418,
        //     latitude: 37.5666583920689,
        //   },
        //   name: "《가시선 너머》",
        //   artist: ["단체전"],
        //   date: "2023.03.25 - 2023.04.02",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/sahngupgallery/",
        // },
        // {
        //   gallery: "카다로그",
        //   introduction: "",
        //   place: "서울 중구 수표로 58-1 3층",
        //   id: 1685332359,
        //   coordinate: {
        //     longitude: 126.98984685591486,
        //     latitude: 37.56645628781836,
        //   },
        //   name: "《원시인 접착제》",
        //   artist: ["오정민"],
        //   date: "2023.03.10 - 2023.03.30",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/cadalogs_space/",
        // },
        // {
        //   gallery: "브레이브썬샤인",
        //   introduction: "",
        //   place: "서울 중구 창경궁로 61 3층",
        //   id: 14244582,
        //   coordinate: {
        //     longitude: 126.997804071696,
        //     latitude: 37.5678892873818,
        //   },
        //   name: "《연보라색 마음》",
        //   artist: ["서평화"],
        //   date: "2023.01.28 - 2023.02.23",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/brave__sunshine/",
        // },
        {
          gallery: "옐로우 펜 클럽",
          introduction: "",
          place: "서울 중구 퇴계로 258 4층",
          id: 536884375,
          coordinate: {
            longitude: 127.000373506889,
            latitude: 37.5624202605212,
          },
          name: "《쿠셔닝 어택》",
          artist: ["단체전"],
          date: "2023.03.30 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/ypc.seoul/",
        },
        // {
        //     gallery: 'DDP 동대문디자인플라자',
        //     introduction: '',
        //     place: '서울 중구 을지로 281 지하 2층 전시 1관',
        //     id: 25753389,
        //     coordinate: { longitude: 127.011536427721, latitude: 37.5671156897561 },
        //     name: '《그러면, 거기》',
        //     artist: ['장 줄리앙'],
        //     date: '2022.10.1 - 2023.01.24',
        //     time: '',
        //     price: 20000,
        //     link: 'https://www.instagram.com/gallery_huette/'
        // },
        // {
        //   gallery: "롯데갤러리 본점",
        //   introduction: "",
        //   place: "서울 중구 을지로 30 롯데백화점",
        //   id: 25042430,
        //   coordinate: {
        //     longitude: 126.981799345353,
        //     latitude: 37.5652263628578,
        //   },
        //   name: "《The Great Outdoors》",
        //   artist: ["김경민", "김지구", "윤상윤", "키미작"],
        //   date: "2023.01.13 - 2023.03.02",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/lottegallery_official?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //     gallery: 'YK Presents',
        //     introduction: '',
        //     place: '서울 중구 을지로43길 13 대화빌딩',
        //     id: 1729186886,
        //     coordinate: { longitude: 127.006802759083, latitude: 37.5668890064546 },
        //     name: '《Binary Sunset View》',
        //     artist: ['이연석', '이용재'],
        //     date: '2023.01.07 - 2023.01.29',
        //     time: '',
        //     price: 0,
        //     link: 'https://instagram.com/yk_presents?igshid=YmMyMTA2M2Y='
        // },
      ],
      seongbuk_exhibition_list: [
        {
          gallery: "팩션",
          introduction: "",
          place: "서울 성북구 삼선교로 78",
          id: 510007146,
          coordinate: {
            longitude: 127.01413951316,
            latitude: 37.5894348336662,
          },
          name: "《하나의 손목시계 그리고 열 개의 손가락》",
          artist: ["단체전"],
          date: "2023.04.05 - 2023.04.28",
          time: "",
          price: 0,
          link: "https://www.instagram.com/faction.seoul/",
        },
        // {
        //   gallery: "유영공간",
        //   introduction: "",
        //   place: "서울 성북구 성북로16가길 1",
        //   id: 243284049,
        //   coordinate: {
        //     longitude: 127.0003951783999,
        //     latitude: 37.59394424435818,
        //   },
        //   name: "《흐름 시퀀스》",
        //   artist: ["임성희"],
        //   date: "2023.02.08 - 2023.02.24",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/spaceuooyoung/",
        // },
        {
          gallery: "챔버1965",
          introduction: "",
          place: "서울 성북구 동소문로 26-6",
          id: 1143270161,
          coordinate: {
            longitude: 127.009035327874,
            latitude: 37.5893416315225,
          },
          name: "《YOU JUST ACTIVATED MY TRAP CARD》",
          artist: ["남다현"],
          date: "2023.04.01 - 2023.04.25",
          time: "",
          price: 0,
          link: "https://www.instagram.com/chamber1965/",
        },
      ],
      itaewon_exhibition_list: [
        {
          gallery: "워킹하우스뉴욕 한남",
          introduction: "",
          place: "서울 용산구 한남대로20길, 21-18 3층",
          id: 1601522559,
          coordinate: {
            longitude: 127.009105731361,
            latitude: 37.5352205625411,
          },
          name: "《DOUBLE IMAGE》",
          artist: ["양시영"],
          date: "2023.03.25 - 2023.06.24",
          time: "",
          price: 0,
          link: "https://www.instagram.com/walkinghouse.newyork/",
        },
        {
          gallery: "가나아트 나인원",
          introduction: "",
          place: "서울 용산구 한남대로 91",
          id: 1851158797,
          coordinate: {
            longitude: 127.004719252252,
            latitude: 37.5362785940696,
          },
          name: "《Unseen》",
          artist: ["안성하"],
          date: "2023.03.16 - 2023.04.16",
          time: "",
          price: 0,
          link: "https://www.instagram.com/ganaart_seoul/",
        },
        {
          gallery: "갤러리그라프",
          introduction: "",
          place: "서울 용산구 독서당로 123",
          id: 780187968,
          coordinate: {
            longitude: 127.012151861554,
            latitude: 37.5372322226777,
          },
          name: "《HALO》",
          artist: ["김순철"],
          date: "2023.03.29 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallerygrappe/",
        },
        {
          gallery: "페이스갤러리",
          introduction: "",
          place: "서울 용산구 이태원로 267",
          id: 742665957,
          coordinate: {
            longitude: 127.001081692562,
            latitude: 37.5385113624193,
          },
          name: "《Saul Steinberg》",
          artist: ["Saul Steinberg"],
          date: "2023.03.31 - 2023.04.29",
          time: "",
          price: 0,
          link: "https://www.instagram.com/pacegallery/",
        },
        {
          gallery: "파운드리서울",
          introduction: "",
          place: "서울 용산구 이태원로 223 지하 1,2층",
          id: 958016825,
          coordinate: {
            longitude: 126.99852913904,
            latitude: 37.5354623726254,
          },
          name: "《Oyster Dream》",
          artist: ["Fernanda Galva"],
          date: "2023.03.17 - 2023.05.13",
          time: "",
          price: 0,
          link: "https://www.instagram.com/foundryseoul/",
        },
        // {
        //   gallery: "BHAK",
        //   introduction: "",
        //   place: "서울 용산구 한남대로40길 19",
        //   id: 7879255,
        //   coordinate: {
        //     longitude: 127.00319095321318,
        //     latitude: 37.54288657978156,
        //   },
        //   name: "《흙갈피》",
        //   artist: ["윤형근"],
        //   date: "2023.03.02 - 2023.04.08",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/galeriebhak/",
        // },
        // {
        //   gallery: "알부스갤러리",
        //   introduction: "",
        //   place: "서울 용산구 한남대로28길 26",
        //   id: 1220368145,
        //   coordinate: {
        //     longitude: 127.005901762873,
        //     latitude: 37.5382048798109,
        //   },
        //   name: "《아침에 눈을 뜨면》",
        //   artist: ["노석미"],
        //   date: "2023.02.01 - 2023.03.19",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/albusgallery/",
        // },
        // {
        //   gallery: "갤러리에스피",
        //   introduction: "",
        //   place: "서울 용산구 회나무로44가길 30",
        //   id: 1016511925,
        //   coordinate: {
        //     longitude: 126.994288316609,
        //     latitude: 37.5383094051892,
        //   },
        //   name: "《Heart of the Eyes》",
        //   artist: ["김민수", "문규화"],
        //   date: "2023.02.15 - 2023.03.18",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallery__sp/",
        // },
        // {
        //   gallery: "LKIF 갤러리",
        //   introduction: "",
        //   place: "서울 용산구 한남대로27길 36-63 2층",
        //   id: 1304587952,
        //   coordinate: {
        //     longitude: 127.00328135224433,
        //     latitude: 37.54004662598601,
        //   },
        //   name: "《Relaxical Landscape》",
        //   artist: ["Hin"],
        //   date: "2023.03.04 - 2023.03.22",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/lkifgallery/",
        // },
        {
          gallery: "휘슬",
          introduction: "",
          place: "서울 용산구 회나무로13길 12 3층",
          id: 1062290097,
          coordinate: {
            longitude: 126.989662632384,
            latitude: 37.5398768311142,
          },
          name: "《Detachment》",
          artist: ["강동호"],
          date: "2023.03.10 - 2023.04.15",
          time: "",
          price: 0,
          link: "https://www.instagram.com/whistle_seoul/",
        },
        // {
        //   gallery: "스튜디오콘크리트",
        //   introduction: "",
        //   place: "서울 용산구 한남대로 162",
        //   id: 27153079,
        //   coordinate: {
        //     longitude: 127.00251653851535,
        //     latitude: 37.54245051227351,
        //   },
        //   name: "《동그라미를 위하여》",
        //   artist: ["권철화"],
        //   date: "2023.01.26 - 2023.03.26",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/studioconcrete/",
        // },
        // {
        //   gallery: "P21",
        //   introduction: "",
        //   place: "서울 용산구 회나무로 74",
        //   id: 1493547980,
        //   coordinate: {
        //     longitude: 126.994781494324,
        //     latitude: 37.5403925402595,
        //   },
        //   name: "《천산수몽》",
        //   artist: ["박성소영"],
        //   date: "2023.02.17 - 2023.04.01",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/p21.kr/",
        // },
        // {
        //   gallery: "디스위켄드룸",
        //   introduction: "",
        //   place: "서울 용산구 한남대로42길 30",
        //   id: 215146673,
        //   coordinate: {
        //     longitude: 127.00308913807343,
        //     latitude: 37.543463222183284,
        //   },
        //   name: "《채집된 방》",
        //   artist: ["최지원"],
        //   date: "2023.03.03 - 2023.04.08",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/thisweekendroom_official/",
        // },
        // {
        //   gallery: "토마스파크",
        //   introduction: "",
        //   place: "서울 용산구 이태원로 199 4층",
        //   id: 1222683124,
        //   coordinate: {
        //     longitude: 126.996198422154,
        //     latitude: 37.5348316200716,
        //   },
        //   name: "《chocolate milk cow milk》",
        //   artist: ["Hae Won Sohn"],
        //   date: "2023.02.07 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://thomaspark.site/thomas-park-exhibitions-current/",
        // },
        {
          gallery: "파이프갤러리",
          introduction: "",
          place: "서울 용산구 대사관로 21",
          id: 353382040,
          coordinate: {
            longitude: 127.000814616475,
            latitude: 37.5341559278121,
          },
          name: "《am is are》",
          artist: ["오다교"],
          date: "2023.04.05 - 2023.05.04",
          time: "",
          price: 0,
          link: "https://instagram.com/pipe_gallery?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "리움미술관",
          introduction: "",
          place: "서울 용산구 이태원로55길 60-16",
          id: 10427225,
          coordinate: {
            longitude: 126.99911744955163,
            latitude: 37.53833657002706,
          },
          name: "《WE》",
          artist: ["마우리치오 카텔란"],
          date: "2023.01.31 - 2023.07.16",
          time: "",
          price: 0,
          link: "https://instagram.com/leeummuseumofart?igshid=YmMyMTA2M2Y=",
        },
        // {
        //   gallery: "갤러리ERD",
        //   introduction: "",
        //   place: "서울 용산구 회나무로13가길 25",
        //   id: 957475674,
        //   coordinate: {
        //     longitude: 126.99094786946057,
        //     latitude: 37.541075266538286,
        //   },
        //   name: "《점이와 점증》",
        //   artist: ["김창겸"],
        //   date: "2023.01.28 - 2023.02.26",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/galerie_erd?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "갤러리 바톤",
          introduction: "",
          place: "서울 용산구 동서당로 116",
          id: 9085363,
          coordinate: {
            longitude: 127.01217435522621,
            latitude: 37.53639879490747,
          },
          name: "《Faint Afterglow》",
          artist: ["기획전"],
          date: "2023.01.11 - 2023.02.18",
          time: "",
          price: 0,
          link: "https://instagram.com/gallerybaton?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "현대카드 스토리지",
          introduction: "",
          place: "서울 용산구 이태원로 248",
          id: 1613335532,
          coordinate: {
            longitude: 127.00085990334,
            latitude: 37.5368030675472,
          },
          name: "《DRIFT : In Sync with the Earth》",
          artist: ["현대카드 스토리지"],
          date: "2022.12.08 - 2023.04.16",
          time: "",
          price: 0,
          link: "https://www.instagram.com/hyundaicard_dive/",
        },
        {
          gallery: "타데우스 로팍",
          introduction: "",
          place: "서울 용산구 독서당로 122-1",
          id: 612582743,
          coordinate: {
            longitude: 127.012855562366,
            latitude: 37.5368465199743,
          },
          name: "《그리자유 : 빛의 연회장》",
          artist: ["미구엘 바르셀로"],
          date: "2023.03.09 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/thaddaeusropac/",
        },
        // {
        //   gallery: "VSF",
        //   introduction: "",
        //   place: "서울 용산구 독서당로 79",
        //   id: 129306809,
        //   coordinate: {
        //     longitude: 127.009178033538,
        //     latitude: 37.5343294671483,
        //   },
        //   name: "《Imaginary Intervention》",
        //   artist: ["존 밀러"],
        //   date: "2023.01.07 - 2023.02.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/vsf/",
        // },
        // {
        //   gallery: "갤러리조은",
        //   introduction: "",
        //   place: "용산구 이태원로 55가길 3 1층",
        //   id: 27387673,
        //   coordinate: {
        //     longitude: 127.00073545569826,
        //     latitude: 37.538030230937444,
        //   },
        //   name: "《Small Lucky》",
        //   artist: ["소품락희전"],
        //   date: "2022.12.22 - 2023.02.04",
        //   time: "",
        //   price: 0,
        //   link: "https://galleryjoeun.com/kor/exhibitions/current.php",
        // },
      ],
      mapo_exhibition_list: [
        {
          gallery: "얼터사이드",
          introduction: "",
          place: "서울 마포구 방울내로 59 3층",
          id: 892728818,
          coordinate: {
            longitude: 126.901999821869,
            latitude: 37.5597558867932,
          },
          name: "⟪GNOME⟫",
          artist: ["99betaHUD"],
          date: "2023.03.24 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/alterside.kr/",
        },
        // {
        //   gallery: "예술공간 의식주",
        //   introduction: "",
        //   place: "서울 마포구 월드컵로16길 52-19",
        //   id: 1358490354,
        //   coordinate: {
        //     longitude: 126.91280961182888,
        //     latitude: 37.55685594631827,
        //   },
        //   name: "⟪City of CMYK⟫",
        //   artist: ["이소"],
        //   date: "2023.03.25 - 2023.04.09",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/the_necessaries/",
        // },
        {
          gallery: "합정지구",
          introduction: "",
          place: "서울 마포구 월드컵로 40",
          id: 1422884483,
          coordinate: {
            longitude: 126.912465702581,
            latitude: 37.5528624711019,
          },
          name: "⟪더미⟫",
          artist: ["문세린"],
          date: "2023.03.17 - 2023.04.16",
          time: "",
          price: 0,
          link: "https://www.instagram.com/hapjungjigu/",
        },
        // {
        //     gallery: '온수공간',
        //     introduction: '',
        //     place: '서울 마포구 월드컵북로1길 74',
        //     id: 1993482544,
        //     coordinate: { longitude: 126.917815663776, latitude: 37.5534898065016 },
        //     name: '⟪Three Days, Three Nights⟫',
        //     artist: ['손정은'],
        //     date: '2023.03.14 - 2023.04.02',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/os_gonggan/'
        // },
        {
          gallery: "플레이스막2",
          introduction: "",
          place: "서울 서대문구 홍제천로4길 39-26",
          id: 11922740,
          coordinate: {
            longitude: 126.92654312673675,
            latitude: 37.57447975885542,
          },
          name: "Ache",
          artist: ["웁쓰양"],
          date: "2023.04.08 - 2023.04.29",
          time: "",
          price: 0,
          link: "https://www.instagram.com/placemak/",
        },
        {
          gallery: "별관",
          introduction: "",
          place: "서울 마포구 망원로 74 2층",
          id: 745738833,
          coordinate: {
            longitude: 126.90497740913551,
            latitude: 37.55721931159651,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/outhouse.seoul/",
        },
        // {
        //     gallery: 'www스페이스',
        //     introduction: '',
        //     place: '서울 마포구 망원로6길 37 지하 1층',
        //     id: 250331355,
        //     coordinate: { longitude: 126.903802888715, latitude: 37.5552668005838 },
        //     name: '⟪화이트홀로 가는길⟫',
        //     artist: ['신선영'],
        //     date: '2023.01.18 - 2023.01.29',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/www__space/'
        // },
        {
          gallery: "레인보우큐브",
          introduction: "",
          place: "서울 마포구 토정로2길 6-19",
          id: 27583491,
          coordinate: {
            longitude: 126.912914133552,
            latitude: 37.5448403130809,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/rainbowcube_gallery/",
        },
        // {
        //   gallery: "파도",
        //   introduction: "",
        //   place: "서울 마포구 성미산로 198 ",
        //   id: 227193375,
        //   coordinate: {
        //     longitude: 126.91802418609045,
        //     latitude: 37.54909308101398,
        //   },
        //   name: "《흑흑 엉엉 꺽꺽》",
        //   artist: ["김희조", "임아진"],
        //   date: "2023.03.19 - 2023.03.31",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/pado_spacewave/",
        // },
        // {
        //   gallery: "챕터투",
        //   introduction: "",
        //   place: "서울 마포구 동교로27길 54",
        //   id: 927286713,
        //   coordinate: {
        //     longitude: 126.921203611709,
        //     latitude: 37.5602928429239,
        //   },
        //   name: "《일정한 리듬》",
        //   artist: ["이영호"],
        //   date: "2023.03.13 - 2023.04.08",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/chapterii_/",
        // },
        // {
        //     gallery: 'CR Collective',
        //     introduction: '',
        //     place: '서울 마포구 성미산로 120 2층',
        //     id: 711560264,
        //     coordinate: { longitude: 126.92028678196, latitude: 37.5624798470126 },
        //     name: '《대체불가현실: □☞∴∂★∽콜렉티브》',
        //     artist: ['기획전'],
        //     date: '2022.12.08 - 2023.01.28',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/cr_collective_/'
        // },
        {
          gallery: "화인페이퍼",
          introduction: "",
          place: "서울 마포구 연남동1길30",
          id: 695206553,
          coordinate: {
            longitude: 126.92135737062624,
            latitude: 37.56045152085452,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/finepaper_gallery/",
        },
        {
          gallery: "갤러리 아미디 연남",
          introduction: "",
          place: "서울 마포구 성미산로29안길 18 2층",
          id: 420416612,
          coordinate: {
            longitude: 126.923227927727,
            latitude: 37.5651784776228,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallery_amidi/",
        },
      ],
      bukcheon_exhibition_list: [
        {
          gallery: "갤러리현대",
          introduction: "",
          place: "서울 종로구 삼청로 14",
          id: 9475956,
          coordinate: {
            longitude: 126.97985039338869,
            latitude: 37.57728226325563,
          },
          name: "WHOSEUM OF WHO?",
          artist: ["사이먼 후지와라"],
          date: "2023.04.05 - 2023.05.21",
          time: "",
          price: 0,
          link: "https://www.instagram.com/galleryhyundai/",
        },
        {
          gallery: "바라캇컨템포러리",
          introduction: "",
          place: "서울 종로구 삼청로7길 36",
          id: 159296251,
          coordinate: {
            longitude: 126.97985648933854,
            latitude: 37.584069450371935,
          },
          name: "INTEGRATIONS",
          artist: ["셰자드 다우드"],
          date: "2023.03.15 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/barakat_contemporary/",
        },
        {
          gallery: "아트비앤",
          introduction: "",
          place: "서울 종로구 삼청로 22-31 2층",
          id: 1664494795,
          coordinate: {
            longitude: 126.980505718632,
            latitude: 37.577818464872,
          },
          name: "골든워킹맨",
          artist: ["이상원"],
          date: "2023.03.17 - 2023.04.16",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallery_artbn/",
        },
        // {
        //   gallery: "갤러리너트",
        //   introduction: "",
        //   place: "서울 종로구 윤보선길 27",
        //   id: 24660462,
        //   coordinate: {
        //     longitude: 126.98374356063488,
        //     latitude: 37.57728556656086,
        //   },
        //   name: "춤추는 사람들",
        //   artist: ["이용현"],
        //   date: "2023.03.15 - 2023.03.20",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/gallery_knot?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "원앤제이갤러리",
        //   introduction: "",
        //   place: "서울 종로구 북촌로 31-14",
        //   id: 9262688,
        //   coordinate: {
        //     longitude: 126.984141522814,
        //     latitude: 37.5797579485199,
        //   },
        //   name: "멂 몸 맘",
        //   artist: ["이순주"],
        //   date: "2023.02.23 - 2023.03.26",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/oneandjgallery/",
        // },
        // {
        //   gallery: "피비갤러리",
        //   introduction: "",
        //   place: "서울 종로구 북촌로 125-6",
        //   id: 1514398175,
        //   coordinate: {
        //     longitude: 126.983134572064,
        //     latitude: 37.5870486472018,
        //   },
        //   name: "Selected Works",
        //   artist: ["단체전"],
        //   date: "2023.02.02 - 2023.03.18",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/pibigallery/",
        // },
        // {
        //   gallery: "갤러리 도올",
        //   introduction: "",
        //   place: "서울 종로구 삼청로 87",
        //   id: 8176801,
        //   coordinate: {
        //     longitude: 126.981677222271,
        //     latitude: 37.5832174073536,
        //   },
        //   name: "진정한 여행",
        //   artist: ["안다은"],
        //   date: "2023.03.03 - 2023.03.26",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallery_dohl/",
        // },
        // {
        //   gallery: "PKM갤러리",
        //   introduction: "",
        //   place: "서울 종로구 삼청로7길 40",
        //   id: 1542000520,
        //   coordinate: {
        //     longitude: 126.980073858136,
        //     latitude: 37.5840965170627,
        //   },
        //   name: "당신의 아름다운 미래",
        //   artist: ["이원우"],
        //   date: "2023.02.28 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/pkmgallery/",
        // },
        // {
        //   gallery: "아라리오갤러리 서울",
        //   introduction: "",
        //   place: "서울 종로구 율곡로 85",
        //   id: 23575995,
        //   coordinate: {
        //     longitude: 126.98850719564723,
        //     latitude: 37.57787357469807,
        //   },
        //   name: "낭만적 아이러니",
        //   artist: ["그룹전"],
        //   date: "2023.02.01 - 2023.03.18",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/arariogallery_official?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "갤러리신라 서울",
        //   introduction: "",
        //   place: "서울 종로구 삼청로 108",
        //   id: 2091077122,
        //   coordinate: {
        //     longitude: 126.98221343100866,
        //     latitude: 37.585033891751245,
        //   },
        //   name: "Ultra-Marine",
        //   artist: ["김춘수"],
        //   date: "2023.02.18 - 2023.03.18",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/galleryshilla?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "갤러리노와이",
        //   introduction: "",
        //   place: "서울 종로구 윤보선길 23-1",
        //   id: 140811362,
        //   coordinate: {
        //     longitude: 126.983788890073,
        //     latitude: 37.5770693341597,
        //   },
        //   name: "Spectrum 1.0",
        //   artist: ["단체전"],
        //   date: "2023.02.11 - 2023.02.28",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/gallery_nowhy?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "국립현대미술관 서울",
        //   introduction: "",
        //   place: "서울 종로구 삼청로 30",
        //   id: 17952661,
        //   coordinate: {
        //     longitude: 126.9800979573524,
        //     latitude: 37.5787,
        //   },
        //   name: "MMCA 이건희컬렉션 특별전",
        //   artist: ["이중섭"],
        //   date: "2022.08.12 - 2023.04.23",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/mmcakorea?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "국립현대미술관 서울",
          introduction: "",
          place: "서울 종로구 삼청로 30",
          id: 17952661,
          coordinate: {
            longitude: 126.9800979573524,
            latitude: 37.578627489574416,
          },
          name: "여기, 일어서는 땅",
          artist: ["임옥상"],
          date: "2022.10.21 - 2023.03.12",
          time: "",
          price: 4000,
          link: "https://instagram.com/mmcakorea?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "국립현대미술관 서울",
          introduction: "",
          place: "서울 종로구 삼청로 30",
          id: 17952661,
          coordinate: {
            longitude: 126.9800979573524,
            latitude: 37.57852,
          },
          name: "인지 행위로서의 예술",
          artist: ["페터 바이벨"],
          date: "2023.02.03 - 2023.05.14",
          time: "",
          price: 4000,
          link: "https://instagram.com/mmcakorea?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "학고재 Space 1",
          introduction: "",
          place: "서울 종로구 삼청로 50",
          id: 10944712,
          coordinate: {
            longitude: 126.98031709785579,
            latitude: 37.58046555396314,
          },
          name: "시대의 유령과 유령의 시대",
          artist: ["박종규"],
          date: "2023.03.15 - 2023.04.29",
          time: "",
          price: 0,
          link: "https://instagram.com/hakgojaegallery?igshid=YmMyMTA2M2Y=",
        },
        {
            gallery: '아트선재센터',
            introduction: '',
            place: '서울 종로구 율곡로3길 87 1전시실',
            id: 8474452,
            coordinate: { longitude: 126.981836609, latitude: 37.5795738136114 },
            name: '즐겁게! 기쁘게!',
            artist: ['단체전'],
            date: '2023.03.28 - 2023.06.25',
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
            name: '공간은 피막, 피부',
            artist: ['하이디 부허'],
            date: '2023.03.28 - 2023.06.25',
            time: '',
            price: 0,
            link: 'https://www.instagram.com/artsonje_center/'
        },
        {
          gallery: "갤러리41",
          introduction: "",
          place: "서울 종로구 삼청로 22-31 1층",
          id: 19183348,
          coordinate: {
            longitude: 126.980505717692,
            latitude: 37.5778220688486,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallery41_seoul/",
        },
        // {
        //     gallery: '크래프트온더힐',
        //     introduction: '',
        //     place: '서울 종로구 북촌로7길 20 1층',
        //     id: 974437016,
        //     coordinate: { longitude: 126.983890004886, latitude: 37.5806462943974 },
        //     name: 'Open Up',
        //     artist: ['정열'],
        //     date: '2023.03.02 - 2023.03.25',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/crafts_on_the_hill_/'
        // },
        {
          gallery: "코너갤러리",
          introduction: "",
          place: "서울 종로구 북촌로5길 18",
          id: 27139183,
          coordinate: {
            longitude: 126.98394233236853,
            latitude: 37.5794813164535,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/corner_gallery/",
        },
        {
            gallery: '뮤지엄헤드',
            introduction: '',
            place: '서울 종로구 계동길 84-3 1층',
            id: 983287184,
            coordinate: { longitude: 126.98696472317121, latitude: 37.581253042755144 },
            name: '⟪모뉴멘탈⟫',
            artist: ['단체전'],
            date: '2023.02.23 - 2023.04.22',
            time: '',
            price: 0,
            link: 'https://www.instagram.com/museumhead_/'
        },
        // {
        //   gallery: "국제갤러리",
        //   introduction: "",
        //   place: "서울 종로구 삼청로 54",
        //   id: 12447481,
        //   coordinate: {
        //     longitude: 126.980459686997,
        //     latitude: 37.5806836181488,
        //   },
        //   name: "⟪복선伏線을 넘어서 II(Over the Layers II)⟫",
        //   artist: ["홍승혜"],
        //   date: "2023.02.09 - 2023.03.19",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/kukjegallery?igshid=YmMyMTA2M2Y=",
        // },
      ],
      insadong_exhibition_list: [
        // {
        //   gallery: "통인화랑",
        //   introduction: "",
        //   place: "서울 종로구 인사동길 32",
        //   id: 8108796,
        //   coordinate: {
        //     longitude: 126.98578200044678,
        //     latitude: 37.57347462256437,
        //   },
        //   name: "푸르고 푸른 - 산조",
        //   artist: ["이만수"],
        //   date: "2023.03.01 - 2023.03.26",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/tongingallery/",
        // },
        // {
        //   gallery: "선갤러리",
        //   introduction: "",
        //   place: "서울 종로구 인사동5길 8",
        //   id: 13530402,
        //   coordinate: {
        //     longitude: 126.985732297022,
        //     latitude: 37.5729250096653,
        //   },
        //   name: "Winter Masterpieces",
        //   artist: ["기획전"],
        //   date: "2023.01.11 - 2023.02.11",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/sungallery_1977?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "ap갤러리",
          introduction: "",
          place: "서울 종로구 인사동길 40 2층",
          id: 1018843728,
          coordinate: {
            longitude: 126.985111746173,
            latitude: 37.574009730872,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/ap.gallery.seoul/",
        },
        {
          gallery: "갤러리 가이아",
          introduction: "",
          place: "서울 종로구 인사동길 57-1",
          id: 8653346,
          coordinate: {
            longitude: 126.983467821465,
            latitude: 37.5750943097354,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/galeriegaia/",
        },
        {
          gallery: "인영갤러리",
          introduction: "",
          place: "서울 종로구 인사동10길 23-4",
          id: 321192268,
          coordinate: {
            longitude: 126.98625270075253,
            latitude: 37.57464056557581,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/inyounggallery/",
        },
        {
          gallery: "관훈갤러리",
          introduction: "",
          place: "서울 종로구 인사동11길 11",
          id: 12447680,
          coordinate: {
            longitude: 126.984237861444,
            latitude: 37.5738654582578,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/kwanhoongallery/",
        },
      ],
      pyeongchangdong_exhibition_list: [
        {
          gallery: "프라이머리프랙티스",
          introduction: "",
          place: "서울 종로구 창의문로11길 7 지하 1층",
          id: 1392797329,
          coordinate: {
            longitude: 126.963018497728,
            latitude: 37.5940483724792,
          },
          name: "《뼈와 살》",
          artist: ["단체전"],
          date: "2023.03.30 - 2023.05.20",
          time: "",
          price: 0,
          link: "https://www.instagram.com/primary_practice/",
        },
        {
          gallery: "본 갤러리",
          introduction: "",
          place: "서울 종로구 자하문로 299",
          id: 18578840,
          coordinate: {
            longitude: 126.95960522563229,
            latitude: 37.59910001285726,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/bon__gallery/",
        },
      ],
      gwanghwamun_exhibition_list: [
        // {
        //   gallery: "교보아트스페이스",
        //   introduction: "",
        //   place: "서울 종로구 종로 1",
        //   id: 27319342,
        //   coordinate: {
        //     longitude: 126.977804291421,
        //     latitude: 37.5712118946362,
        //   },
        //   name: "《흰 여백, 검은 선》",
        //   artist: ["김선두", "김은주", "정용국"],
        //   date: "2023.01.03 - 2023.02.29",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/kyoboartspace?igshid=YmMyMTA2M2Y=",
        // },
      ],
      seochon_exhibition_list: [
        {
          gallery: "중간지점 둘",
          introduction: "",
          place: "서울 종로구 필운대로5길 5 지하1층",
          id: 2050952729,
          coordinate: {
            longitude: 126.968312666739,
            latitude: 37.5793186797452,
          },
          name: "《Switchback》",
          artist: ["황선정", "황원해"],
          date: "2023.03.25 - 2023.05.21",
          time: "",
          price: 0,
          link: "https://instagram.com/jungganjijeom_ll?igshid=YmMyMTA2M2Y=",
        },
        {
          gallery: "프로젝트 스페이스 사루비아",
          introduction: "",
          place: "서울 종로구 자하문로16길 4 지하",
          id: 25051286,
          coordinate: {
            longitude: 126.97142624584727,
            latitude: 37.581447621821,
          },
          name: "《Unfolded》",
          artist: ["임노식"],
          date: "2023.03.15 - 2023.04.14",
          time: "",
          price: 0,
          link: "https://www.instagram.com/pssarubia/",
        },
        {
          gallery: "팩토리2",
          introduction: "",
          place: "서울 종로구 자하문로10길 15",
          id: 12983379,
          coordinate: {
            longitude: 126.972413039149,
            latitude: 37.5795215318413,
          },
          name: "《변압타워의 모험》",
          artist: ["란디", "카트린"],
          date: "2023.03.23 - 2023.04.23",
          time: "",
          price: 0,
          link: "https://www.instagram.com/factory2.seoul/",
        },
        // {
        //   gallery: "스페이스윌링앤딜링",
        //   introduction: "",
        //   place: "서울 종로구 자하문로 48-1 2층",
        //   id: 17672709,
        //   coordinate: {
        //     longitude: 126.97147535423674,
        //     latitude: 37.58032859949282,
        //   },
        //   name: "《마산, 가린혹》",
        //   artist: ["전지홍"],
        //   date: "2022.02.22 - 2022.03.19",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/space_willingndealing/",
        // },
        // {
        //   gallery: "표갤러리",
        //   introduction: "",
        //   place: "서울 종로구 자하문로5길 18-4",
        //   id: 8129692,
        //   coordinate: {
        //     longitude: 126.97082873644398,
        //     latitude: 37.57789575768786,
        //   },
        //   name: "《New Era》",
        //   artist: ["상설전"],
        //   date: "2023.03.02 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/pyogallery/",
        // },
        // {
        //   gallery: "드로잉룸",
        //   introduction: "",
        //   place: "서울 종로구 자하문로7길 68-4 2층",
        //   id: 1843575438,
        //   coordinate: {
        //     longitude: 126.9692179195912,
        //     latitude: 37.58034605229561,
        //   },
        //   name: "《슬픔은 파도처럼 밀려와》",
        //   artist: ["임지민"],
        //   date: "2023.02.09 - 2023.03.09",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/drawingroomseoul?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "tya 서촌",
        //   introduction: "",
        //   place: "서울 종로구 자하문로5길 28",
        //   id: 136380522,
        //   coordinate: {
        //     longitude: 126.970312542225,
        //     latitude: 37.5778172425068,
        //   },
        //   name: "《孤雲》",
        //   artist: ["노을구름"],
        //   date: "2023.03.24 - 2023.03.30",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallery_tya/",
        // },
        // {
        //   gallery: "갤러리 아트사이드",
        //   introduction: "",
        //   place: "서울 종로구 자하문로6길 15 1층",
        //   id: 8428388,
        //   coordinate: {
        //     longitude: 126.97294784304906,
        //     latitude: 37.578267471918814,
        //   },
        //   name: "《Green to Green》",
        //   artist: ["하태임"],
        //   date: "2023.03.03 - 2023.04.01",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/artsidegallery_/",
        // },
        // {
        //   gallery: "아트스페이스 보안 1",
        //   introduction: "",
        //   place: "아트스페이스 보안 1 서울 종로구 효자로 33",
        //   id: 14562864,
        //   coordinate: {
        //     longitude: 126.97364079381301,
        //     latitude: 37.57910825301889,
        //   },
        //   name: "《물 속의 돌》",
        //   artist: ["이단"],
        //   date: "2023.03.11 - 2023.04.02",
        //   time: "화-일 12시 ~ 18시 (*월 휴무)",
        //   price: 0,
        //   link: "https://www.instagram.com/boan1942/",
        // },
        // {
        //     gallery: '아트스페이스 보안 2',
        //     introduction: '',
        //     place: '서울 종로구 효자로 33 보안1942 지하 1층',
        //     id: 14562864,
        //     coordinate: { longitude: 126.97357900000000, latitude: 37.57914000000000 },
        //     name: '《play, pause, repeat》',
        //     artist: ['송주원', '이양희', '전명은'],
        //     date: '2023.03.11 - 2023.04.08',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/boan1942/'
        // },
        {
          gallery: "갤러리시몬",
          introduction: "",
          place: "서울 종로구 자하문로6길 20",
          id: 8778944,
          coordinate: {
            longitude: 126.97329204906,
            latitude: 37.5781161832806,
          },
          name: "⟪無, Be Nothingness⟫",
          artist: ["배형경"],
          date: "2023.03.16 - 2023.05.20",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallery_simon/",
        },
        {
          gallery: "스페이스로",
          introduction: "",
          place: "서울 종로구 필운대로7길 12 2층",
          id: 418628988,
          coordinate: {
            longitude: 126.967847531568,
            latitude: 37.5815890583045,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/hellospacelo/",
        },
        {
          gallery: "스페이스깨",
          introduction: "",
          place: "서울 종로구 자하문로5길 15",
          id: 1050667060,
          coordinate: {
            longitude: 126.970969217053,
            latitude: 37.5776290980353,
          },
          name: "",
          artist: [],
          date: "",
          time: "",
          price: 0,
          link: "https://www.instagram.com/spaceccae/",
        },
        {
          gallery: "그라운드시소 서촌",
          introduction: "",
          place: "서울 종로구 자하문로6길 18-8",
          id: 341652379,
          coordinate: {
            longitude: 126.972916300185,
            latitude: 37.5778385914657,
          },
          name: "⟪어노니머스 프로젝트: 우리가 멈춰섰던 순간들⟫",
          artist: ["아마추어 사진 컬렉션"],
          date: "2022.11.25 - 2023.04.30",
          time: "",
          price: 0,
          link: "https://www.instagram.com/groundseesaw/",
        },
      ],
      yongsan_exhibition_list: [
        {
          gallery: "아모레퍼시픽미술관",
          introduction: "",
          place: "서울 용산구 한강대로 100",
          id: 12099818,
          coordinate: {
            longitude: 126.96845835929899,
            latitude: 37.5291241314767,
          },
          name: "《조선, 병풍의 나라 2》",
          artist: ["기획전"],
          date: "2023.01.26 - 2023.04.30",
          time: "",
          price: 15000,
          link: "https://instagram.com/amorepacificmuseum?igshid=YmMyMTA2M2Y=",
        },
        // {
        //   gallery: "상업화랑 용산",
        //   introduction: "",
        //   place: "서울 용산구 청파동3가 130-13",
        //   id: 1389443942,
        //   coordinate: {
        //     longitude: 126.9690774960373,
        //     latitude: 37.54210771450059,
        //   },
        //   name: "《프로토타입 템플 - 어떻게 원수를 사랑하지 않을 수 있을까?》",
        //   artist: ["김지민"],
        //   date: "2023.01.28 - 2023.03.12",
        //   time: "",
        //   price: 0,
        //   link: "",
        // },
        {
          gallery: "라흰갤러리",
          introduction: "",
          place: "서울 용산구 한강대로50길 38-7 2층",
          id: 1940012055,
          coordinate: {
            longitude: 126.97258938439214,
            latitude: 37.53079922333253,
          },
          name: "《숨결 : 풍경놀이》",
          artist: ["보킴", "정재나"],
          date: "2023.03.23 - 2023.04.29",
          time: "",
          price: 0,
          link: "https://www.instagram.com/laheen_gallery/",
        },
      ],
      gangnam_exhibition_list: [
        {
          gallery: "갤러리샘",
          introduction: "",
          place: "서울 강남구 테헤란로13길 30",
          id: 70580457,
          coordinate: {
            longitude: 127.031925872544,
            latitude: 37.5015803438509,
          },
          name: "《추상/하기》",
          artist: ["단체전"],
          date: "2023.04.05 - 2023.05.13",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallerysaem/",
        },
        {
          gallery: "서울시립미술관 남서울관",
          introduction: "",
          place: "서울 관악구 남부순환로 2076",
          id: 7937927,
          coordinate: {
            longitude: 126.9794807787916,
            latitude: 37.47607534453375,
          },
          name: "《다호가 나누며, 하나》",
          artist: ["김윤신"],
          date: "2023.02.28 - 2023.05.07",
          time: "",
          price: 0,
          link: "https://www.instagram.com/seoulmuseumofart/",
        },
        {
          gallery: "페리지갤러리",
          introduction: "",
          place: "서울 서초구 반포대로 18",
          id: 19629735,
          coordinate: {
            longitude: 127.01273539882,
            latitude: 37.4822375415116,
          },
          name: "《메아리와 서리의 도서관》",
          artist: ["박선민"],
          date: "2023.03.10 - 2023.04.29",
          time: "",
          price: 0,
          link: "https://www.instagram.com/perigeegallery/",
        },
        {
          gallery: "갤러리로얄",
          introduction: "",
          place: "서울 강남구 논현로 709",
          id: 13302105,
          coordinate: {
            longitude: 127.0297949951916,
            latitude: 37.515244638426125,
          },
          name: "《abstrakte Fotos》",
          artist: ["김도균"],
          date: "2023.02.22 - 2023.04.22",
          time: "",
          price: 0,
          link: "https://www.instagram.com/galleryroyal_/",
        },
        {
          gallery: "이길이구 갤러리",
          introduction: "",
          place: "서울 강남구 강남대로158길 35",
          id: 27334989,
          coordinate: {
            longitude: 127.02147911583907,
            latitude: 37.51975055954737,
          },
          name: "《티타임》",
          artist: ["나난 강"],
          date: "2023.03.18 - 2023.04.22",
          time: "",
          price: 0,
          link: "https://www.instagram.com/2gil29gallery_official/",
        },
        // {
        //   gallery: "갤러리나우",
        //   introduction: "",
        //   place: "서울 강남구 언주로152길 16",
        //   id: 12621061,
        //   coordinate: {
        //     longitude: 127.03496887996587,
        //     latitude: 37.52276028948844,
        //   },
        //   name: "《지지 않은 매화, NoW에 피다》",
        //   artist: ["김창덕"],
        //   date: "2023.03.08 - 2023.03.30",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallerynowseoul/",
        // },
        // {
        //   gallery: "플래티넘 갤러리",
        //   introduction: "",
        //   place: "서울 강남구 삼성로 741",
        //   id: 1807118157,
        //   coordinate: {
        //     longitude: 127.048438874626,
        //     latitude: 37.5215130505751,
        //   },
        //   name: "《봄이여 오라》",
        //   artist: ["태우"],
        //   date: "2023.03.11 - 2023.03.28",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/platinumgallery_official/",
        // },
        // {
        //   gallery: "UM갤러리",
        //   introduction: "",
        //   place: "서울 강남구 가로수길 64 3층",
        //   id: 25051288,
        //   coordinate: {
        //     longitude: 127.022927822906,
        //     latitude: 37.5222947193758,
        //   },
        //   name: "《Sequence》",
        //   artist: ["이본보그"],
        //   date: "2023.03.08 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/umgallery/",
        // },
        // {
        //   gallery: "예화랑",
        //   introduction: "",
        //   place: "서울 강남구 가로수길 73",
        //   id: 8453166,
        //   coordinate: {
        //     longitude: 127.02221758199438,
        //     latitude: 37.52287870483579,
        //   },
        //   name: "《HOMAGE to HOMO SAPIENS》",
        //   artist: ["곽훈"],
        //   date: "2023.03.02 - 2023.03.31",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/gallery_yeh/",
        // },
        // {
        //   gallery: "칼리파갤러리",
        //   introduction: "",
        //   place: "서울 강남구 압구정로 134",
        //   id: 19583947,
        //   coordinate: {
        //     longitude: 127.02350765624689,
        //     latitude: 37.52434168316362,
        //   },
        //   name: "《아령, 편안함에 이르렀는가?》",
        //   artist: ["아령"],
        //   date: "2023.03.03 - 2023.03.31",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/khalifagallery_/",
        // },
        // {
        //   gallery: "도잉아트",
        //   introduction: "",
        //   place: "서울 서초구 남부순환로325길 9 지하1층",
        //   id: 590921596,
        //   coordinate: {
        //     longitude: 127.01453976235,
        //     latitude: 37.4816210431703,
        //   },
        //   name: "《Like a Rhythm》",
        //   artist: ["전영진", "장희진"],
        //   date: "2023.03.02 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/dohing_art/",
        // },
        // {
        //   gallery: "스페이스비이갤러리",
        //   introduction: "",
        //   place: "서울 강남구 학동로26길 14 윤현빌딩 3층",
        //   id: 16065057,
        //   coordinate: {
        //     longitude: 127.029480595505,
        //     latitude: 37.5125047642335,
        //   },
        //   name: "《Dancing Grid》",
        //   artist: ["단체전"],
        //   date: "2023.02.01 - 2023.03.25",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/spacebe_official/",
        // },
        // {
        //   gallery: "김리아갤러리",
        //   introduction: "",
        //   place: "서울 강남구 압구정로75길 5",
        //   id: 16021912,
        //   coordinate: {
        //     longitude: 127.04685367189131,
        //     latitude: 37.526360181897346,
        //   },
        //   name: "《Selected Works》",
        //   artist: ["구자현"],
        //   date: "2023.02.22 - 2023.03.23",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/kimreeaagallery_official/",
        // },
        // {
        //   gallery: "플랫폼엘",
        //   introduction: "",
        //   place: "서울 강남구 언주로133길 11",
        //   id: 27502701,
        //   coordinate: {
        //     longitude: 127.034264497181,
        //     latitude: 37.5161687572057,
        //   },
        //   name: "《제3의 자연》",
        //   artist: ["Kaya"],
        //   date: "2023.01.17 - 2023.03.12",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/platforml.official?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "서정아트 강남",
        //   introduction: "",
        //   place: "서울 강남구 봉은사로47길 12",
        //   id: 1186222738,
        //   coordinate: {
        //     longitude: 127.04122022321059,
        //     latitude: 37.5106271618897,
        //   },
        //   name: "《The Other Face of Material》",
        //   artist: ["단체전"],
        //   date: "2023.02.01 - 2023.03.08",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/seojung_art?igshid=YmMyMTA2M2Y=",
        // },
        {
          gallery: "유나이티드 갤러리",
          introduction: "",
          place: "서울 강남구 강남대로102길 41",
          id: 1289408678,
          coordinate: {
            longitude: 127.028038519252,
            latitude: 37.5035851671613,
          },
          name: "《공간 산책자》",
          artist: ["단체전"],
          date: "2023.02.08 - 2023.02.13",
          time: "",
          price: 0,
          link: "https://instagram.com/unitedgallery?igshid=YmMyMTA2M2Y=",
        },
        // {
        //   gallery: "신사하우스",
        //   introduction: "",
        //   place: "서울 강남구 강남대로162길 27",
        //   id: 1826758447,
        //   coordinate: {
        //     longitude: 127.020633162734,
        //     latitude: 37.5204048385658,
        //   },
        //   name: "《토끼전》",
        //   artist: ["SPEEKER 단체전"],
        //   date: "2023.02.04 - 2023.02.26",
        //   time: "",
        //   price: 15000,
        //   link: "https://instagram.com/sinsahouse?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "ALTER SIGHT KESSON",
        //   introduction: "",
        //   place: "서울 강남구 언주로133길 20",
        //   id: 1586008604,
        //   coordinate: {
        //     longitude: 127.033507864051,
        //     latitude: 37.5163915221652,
        //   },
        //   name: "《Happy Re;Construction Day》",
        //   artist: ["FORI"],
        //   date: "2023.01.27 - 2023.02.28",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/gallerystan_by_acny?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "갤러리스탠",
        //   introduction: "",
        //   place: "서울 강남구 학동로12길 45",
        //   id: 439578454,
        //   coordinate: {
        //     longitude: 127.027801155441,
        //     latitude: 37.5100508355412,
        //   },
        //   name: "《Janus》",
        //   artist: ["Bazbon"],
        //   date: "2023.02.11 - 2023.03.05",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/gallerystan_by_acny?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "로이갤러리 압구정",
        //   introduction: "",
        //   place: "서울 강남구 압구정로42길 24-6",
        //   id: 202893702,
        //   coordinate: {
        //     longitude: 127.034606785864,
        //     latitude: 37.5274474098138,
        //   },
        //   name: "《THE SCRIBBLED LINE IS LIFE》",
        //   artist: ["Kingscribbler"],
        //   date: "2023.02.11 - 2023.03.05",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/roygalleryseoul?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "프롬프트 프로젝트",
        //   introduction: "",
        //   place: "서울 강남구 개포로17길 28 2,3층",
        //   id: 854611366,
        //   coordinate: {
        //     longitude: 127.046835168302,
        //     latitude: 37.4804530566745,
        //   },
        //   name: "《BRING TO LIGHT》",
        //   artist: ["5인전"],
        //   date: "2023.01.11 - 2023.02.26",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/prompt_project?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "로이갤러리 청담",
        //   introduction: "",
        //   place: "서울 강남구 선릉로146길 27-8",
        //   id: 205646515,
        //   coordinate: {
        //     longitude: 127.042308087401,
        //     latitude: 37.5222731490917,
        //   },
        //   name: "《Truths and Lies》",
        //   artist: ["최운형"],
        //   date: "2023.01.27 - 2023.02.26",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/roygalleryseoul?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "예술의전당 한가람미술관",
        //   introduction: "",
        //   place: "서울 서초구 남부순환로 2406",
        //   id: 20496825,
        //   coordinate: { longitude: 127.0142, latitude: 37.4804281441544 },
        //   name: "《어제의 미래》",
        //   artist: ["마리아 스바르보바"],
        //   date: "2022.12.10 - 2023.02.26",
        //   time: "",
        //   price: 20000,
        //   link: "https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "예술의전당 한가람미술관",
        //   introduction: "",
        //   place: "서울 서초구 남부순환로 2406",
        //   id: 20496825,
        //   coordinate: {
        //     longitude: 127.014236530093,
        //     latitude: 37.4804281441544,
        //   },
        //   name: "《Mickey Mouse Now And Future》",
        //   artist: ["기획전"],
        //   date: "2022.12.10 - 2023.04.09",
        //   time: "",
        //   price: 20000,
        //   link: "https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //   gallery: "예술의전당 한가람미술관",
        //   introduction: "",
        //   place: "서울 서초구 남부순환로 2406",
        //   id: 20496825,
        //   coordinate: { longitude: 127.0144, latitude: 37.48042 },
        //   name: "《WATSON, THE MAESTRO》",
        //   artist: ["기획전"],
        //   date: "2022.12.08 - 2023.03.30",
        //   time: "",
        //   price: 20000,
        //   link: "https://instagram.com/seoul_arts_center?igshid=YmMyMTA2M2Y=",
        // },
        // {
        //     gallery: '갤러리 띠오',
        //     introduction: '',
        //     place: '서울 서초구 강남대로97길 27 1층',
        //     id: 1622537281,
        //     coordinate: { longitude: 127.01826070161901, latitude: 37.51442436828548 },
        //     name: '《피니치오니 : 끝에게》',
        //     artist: ['박그림', '태킴'],
        //     date: '2023.03.03 - 2023.03.31',
        //     time: '',
        //     price: 0,
        //     link: 'https://www.instagram.com/theogallery_official/'
        // },
      ],
      munrae_exhibition_list: [
        // {
        //   gallery: "구캔갤러리",
        //   introduction: "",
        //   place: "서울 구로구 경인로 661 신도림1차푸르지오 101동 306호",
        //   id: 1315584631,
        //   coordinate: {
        //     longitude: 126.886987229389,
        //     latitude: 37.5090494853742,
        //   },
        //   name: "새로운 시작",
        //   artist: ["단체전"],
        //   date: "2023.01.05 - 2023.02.12",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/goocan_official/",
        // },
      ],
      myeongdong_exhibition_list: [
        {
          gallery: "피크닉",
          introduction: "",
          place: "서울 중구 퇴계로6가길 30",
          id: 225473638,
          coordinate: {
            longitude: 126.97812314817759,
            latitude: 37.556958192580645,
          },
          name: "국내여행 전시",
          artist: ["기획전"],
          date: "2022.10.21 - 2023.02.19",
          time: "",
          price: 0,
          link: "https://instagram.com/piknic.kr?igshid=YmMyMTA2M2Y=",
        },
      ],
      cityhall_exhibition_list: [
        // {
        //   gallery: "일우스페이스",
        //   introduction: "",
        //   place: "서울 중구 서소문로 117 대한항공 빌딩 1층",
        //   id: 13559605,
        //   coordinate: {
        //     longitude: 126.974171070572,
        //     latitude: 37.5634697997132,
        //   },
        //   name: "플록(Flock)",
        //   artist: ["스튜디오 렌카"],
        //   date: "2023.02.10 - 2023.03.17",
        //   time: "",
        //   price: 0,
        //   link: "https://www.instagram.com/ilwoospace_/",
        // },
        // {
        //   gallery: "서울시립미술관 서소문본관",
        //   introduction: "",
        //   place: "서울 중구 덕수궁길 61",
        //   id: 10507051,
        //   coordinate: {
        //     longitude: 126.973790543874,
        //     latitude: 37.5641076212639,
        //   },
        //   name: "자유낙하",
        //   artist: ["키키스미스"],
        //   date: "2022.12.15 - 2023.03.12",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/seoulmuseumofart?igshid=YmMyMTA2M2Y=",
        // },
      ],
      yaksu_exhibition_list: [
        // {
        //   gallery: "페이토갤러리",
        //   introduction: "",
        //   place: "서울 중구 동호로 220 4층",
        //   id: 80219699,
        //   coordinate: {
        //     longitude: 127.009109579831,
        //     latitude: 37.5575518231663,
        //   },
        //   name: "Into the Candyverse",
        //   artist: ["노준"],
        //   date: "2023.01.26 - 2023.02.25",
        //   time: "",
        //   price: 0,
        //   link: "https://instagram.com/peytogallery?igshid=YmMyMTA2M2Y=",
        // },
      ],
      yeouido_exhibition_list: [
        {
          gallery: "더현대 서울",
          introduction: "",
          place: "서울 영등포구 여의대로 108",
          id: 1662602781,
          coordinate: {
            longitude: 126.92844612411159,
            latitude: 37.525872071029134,
          },
          name: "프로방스에서 온 댄디보이",
          artist: ["다비드 자맹"],
          date: "2023.02.04 - 2023.04.27",
          time: "",
          price: 18000,
          link: "https://instagram.com/thehyundai_seoul?igshid=YmMyMTA2M2Y=",
        },
      ],
      jongro_exhibition_list: [
        {
          gallery: "갤러리마리",
          introduction: "",
          place: "서울 종로구 경희궁 1길 35",
          id: 586091847,
          coordinate: {
            longitude: 126.969037676979,
            latitude: 37.5727163847014,
          },
          name: "소우주",
          artist: ["박상혁"],
          date: "2023.03.08 - 2023.04.21",
          time: "",
          price: 0,
          link: "https://www.instagram.com/gallerymarie_/",
        },
      ]
    };
  },
  async mounted() {
    document.getElementById("app").style.setProperty("overflow", "hidden");
    let marker_image_src = require("../assets/marker.svg");
    let marker_image_size = new kakao.maps.Size(36, 51);
    this.marker_image = new kakao.maps.MarkerImage(
      marker_image_src,
      marker_image_size
    );

    let selected_marker_image_src = require("../assets/marker_selected.svg");
    let selected_marker_image_size = new kakao.maps.Size(45, 64);
    this.selected_marker_image = new kakao.maps.MarkerImage(
      selected_marker_image_src,
      selected_marker_image_size
    );

    // 임시 을지로 우선
    this.selected_category_index = 1;
    await this.setMapByCategory(
      this.category_list[this.selected_category_index],
      true
    );
  },
  unmounted() {
    document.getElementById("app").style.setProperty("overflow", "scroll");
  },
  methods: {
    convetString(english) {
      let korean = "";
      switch (english) {
        case "\%\%":
          korean = "전체";
          break;
        case "hannam":
          korean = "한남";
          break;
        case "gangnam":
          korean = "강남";
          break;
        case "yongsan":
          korean = "용산";
          break;
        case "itaewon":
          korean = "이태원";
          break;
        case "jamsil":
          korean = "잠실";
          break;
        case "seongsu":
          korean = "성수";
          break;
        case "seongbuk":
          korean = "성북";
          break;
        case "mapo":
          korean = "마포";
          break;
        case "bukcheon":
          korean = "북촌";
          break;
        case "insadong":
          korean = "인사동";
          break;
        case "pyeongchangdong":
          korean = "평창동";
          break;
        case "gwanghwamun":
          korean = "광화문";
          break;
        case "seochon":
          korean = "서촌";
          break;
        case "nonhyeon":
          korean = "논현";
          break;
        case "yeonnam":
          korean = "연남";
          break;
        case "uljiro":
          korean = "을지로";
          break;
        case "munrae":
          korean = "문래";
          break;
        case "myeongdong":
          korean = "명동";
          break;
        case "cityhall":
          korean = "시청";
          break;
        case "yaksu":
          korean = "약수";
          break;
        case "yeouido":
          korean = "여의도";
          break;
        case "jongro":
          korean = "종로";
          break;
        default:
          korean = "wrong_category";
      }
      return korean;
    },
    async selectCategory(category, index) {
      if (index === this.selected_category_index) return;

      this.selected_category_index = index;
      await this.setMapByCategory(category);
      this.no_result = false;
    },
    async setMapByCategory(category, initialize = false) {
      this.$refs.drawer.closeDrawer();
      this.$refs.drawer.$el.style.setProperty("bottom", "0");
      // 임시 을지로
      if (true) {
        let exhibition_list = [];

        if (category === "uljiro") {
          exhibition_list = this.uljiro_exhibition_list;
        } else if (category === "gangnam") {
          exhibition_list = this.gangnam_exhibition_list;
        } else if (category === "seongsu") {
          exhibition_list = this.seongsu_exhibition_list;
        } else if (category === "munrae") {
          exhibition_list = this.munrae_exhibition_list;
        } else if (category === "seongsu") {
          exhibition_list = this.seongsu_exhibition_list;
        } else if (category === "yongsan") {
          exhibition_list = this.yongsan_exhibition_list;
        } else if (category === "jamsil") {
          exhibition_list = this.jamsil_exhibition_list;
        } else if (category === "itaewon") {
          exhibition_list = this.itaewon_exhibition_list;
        } else if (category === "seongbuk") {
          exhibition_list = this.seongbuk_exhibition_list;
        } else if (category === "mapo") {
          exhibition_list = this.mapo_exhibition_list;
        } else if (category === "bukcheon") {
          exhibition_list = this.bukcheon_exhibition_list;
        } else if (category === "insadong") {
          exhibition_list = this.insadong_exhibition_list;
        } else if (category === "pyeongchangdong") {
          exhibition_list = this.pyeongchangdong_exhibition_list;
        } else if (category === "gwanghwamun") {
          exhibition_list = this.gwanghwamun_exhibition_list;
        } else if (category === "seochon") {
          exhibition_list = this.seochon_exhibition_list;
        } else if (category === "myeongdong") {
          exhibition_list = this.myeongdong_exhibition_list;
        } else if (category === "cityhall") {
          exhibition_list = this.cityhall_exhibition_list;
        } else if (category === "yaksu") {
          exhibition_list = this.yaksu_exhibition_list;
        } else if (category === "yeouido") {
          exhibition_list = this.yeouido_exhibition_list;
        } else if (category === "jongro") {
          exhibition_list = this.jongro_exhibition_list;
        } else {
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
            ...this.yongsan_exhibition_list,
            ...this.myeongdong_exhibition_list,
            ...this.cityhall_exhibition_list,
            ...this.yaksu_exhibition_list,
            ...this.yeouido_exhibition_list,
            ...this.jongro_exhibition_list,
          ];
        }

        let mean_latitude = 0;
        let mean_longitude = 0;
        for (let exhibition of exhibition_list) {
          mean_latitude += exhibition.coordinate.latitude;
          mean_longitude += exhibition.coordinate.longitude;
        }
        mean_latitude /= 6;
        mean_longitude /= 6;
        this.setMapCenter(mean_latitude, mean_longitude, initialize);

        let i = 0;
        for (i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
        this.markers = new Array(0);

        // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < exhibition_list.length; i++) {
          let coordinate = exhibition_list[i].coordinate;
          let latlng = new kakao.maps.LatLng(
            coordinate.latitude,
            coordinate.longitude
          );
          // LatLngBounds 객체에 좌표 추가
          bounds.extend(latlng);

          let marker = new kakao.maps.Marker({
            map: this.map,
            position: latlng,
            title: i.toString(),
            image: this.marker_image,
            clickable: true,
            zIndex: 0,
          });

          const _this = this;
          kakao.maps.event.addListener(marker, "click", function () {
            if (_this.selected_marker === marker) {
              return;
            } else if (_this.selected_marker !== null) {
              _this.selected_marker.setImage(_this.marker_image);
            }

            for (i of _this.markers) {
              i.setZIndex(0);
            }

            marker.setImage(_this.selected_marker_image);
            _this.selected_marker = marker;
            _this.selected_marker.setZIndex(1);

            let title = "";
            for (
              let i = 0;
              i < exhibition_list[marker.getTitle()].artist.length;
              i++
            ) {
              title += exhibition_list[marker.getTitle()].artist[i] + " ";
            }
            title += ": ";
            title += exhibition_list[marker.getTitle()].name;
            _this.$refs.exhibitionName.innerText = title;
            _this.$refs.exhibitionInformation.innerText = exhibition_list[
              marker.getTitle()
            ].introduction;
            _this.$refs.exhibitionPlace.innerText =
              exhibition_list[marker.getTitle()].gallery +
              " (" +
              exhibition_list[marker.getTitle()].place +
              ")";
            _this.$refs.exhibitionDate.innerText =
              exhibition_list[marker.getTitle()].date;
            _this.$refs.exhibitionTime.innerText =
              exhibition_list[marker.getTitle()].time;
            _this.$refs.exhibitionFee.innerText = exhibition_list[
              marker.getTitle()
            ].price
              ? exhibition_list[marker.getTitle()].price + "원"
              : "무료";
            _this.$refs.exhibitionLink.setAttribute(
              "href",
              exhibition_list[marker.getTitle()].link
            );
            _this.drawer_height = _this.$refs.drawer.$el.clientHeight;
            _this.$refs.drawer.$el.style.setProperty(
              "bottom",
              `${_this.drawer_height / 3}px`
            );
            _this.no_result = false;
          });

          this.markers.push(marker);
        }

        this.map.setBounds(bounds);
        return;
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
    setMapCenter(latitude, longitude, initialize = false) {
      let moveLatLon = new kakao.maps.LatLng(latitude, longitude);
      if (initialize) {
        let mapContainer = document.getElementById("map");
        let mapOption = {
          center: moveLatLon,
          level: 3,
        };
        this.map = new kakao.maps.Map(mapContainer, mapOption);

        return;
      }
      this.map.setCenter(moveLatLon);
    },
    setMarkers(exhibition_map_object_list) {
      // 기존의 마커들 삭제
      let i = 0;
      for (i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = new Array(0);

      // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체
      let bounds = new kakao.maps.LatLngBounds();

      for (let i = 0; i < exhibition_map_object_list.length; i++) {
        let coordinate = exhibition_map_object_list[i].coordinate;
        let latlng = new kakao.maps.LatLng(
          coordinate.latitude,
          coordinate.longitude
        );
        // LatLngBounds 객체에 좌표 추가
        bounds.extend(latlng);

        let marker = new kakao.maps.Marker({
          map: this.map,
          position: latlng,
          title: i.toString(),
          image: this.marker_image,
          clickable: true,
        });

        // const _this = this
        // kakao.maps.event.addListener(marker, 'click', async function () {
        //     await _this.clickMarker(marker)
        // })

        // 임시 프론트 구간
        const _this = this;
        kakao.maps.event.addListener(marker, "click", function () {
          if (_this.selected_marker === marker) {
            return;
          } else if (_this.selected_marker !== null) {
            _this.selected_marker.setImage(_this.marker_image);
          }

          for (i of _this.markers) {
            i.setZIndex(0);
          }

          marker.setImage(_this.selected_marker_image);
          _this.selected_marker = marker;
          _this.selected_marker.setZIndex(1);
          _this.$refs.exhibitionName.innerText =
            exhibition_map_object_list[marker.getTitle()].name;
          _this.$refs.exhibitionInformation.innerText =
            exhibition_map_object_list[marker.getTitle()].introduction;
          _this.$refs.exhibitionDate.innerText =
            "기간 : " + exhibition_map_object_list[marker.getTitle()].date;
          _this.$refs.exhibitionTime.innerText =
            "시간 : " + exhibition_map_object_list[marker.getTitle()].time;
          _this.$refs.exhibitionPlace.innerText =
            "장소 : " + exhibition_map_object_list[marker.getTitle()].place;
          _this.$refs.exhibitionLink.setAttribute(
            "href",
            exhibition_map_object_list[marker.getTitle()].link
          );
          _this.drawer_height = _this.$refs.drawer.$el.clientHeight;
          _this.$refs.drawer.$el.style.setProperty(
            "bottom",
            `${_this.drawer_height / 3}px`
          );
          _this.no_result = false;
        });

        // 임시 프론트 구간
        this.markers.push(marker);
      }

      this.map.setBounds(bounds);
    },
    async clickMarker(marker) {
      if (this.selected_marker === marker) {
        return;
      } else if (this.selected_marker !== null) {
        this.selected_marker.setImage(this.marker_image);
      }
      marker.setImage(this.selected_marker_image);
      this.selected_marker = marker;

      await this.setDrawer(this.selected_marker.getTitle());
      this.no_result = false;
    },
    async setDrawer(exhibition_pageId) {
      let exhibition = await new Exhibition(exhibition_pageId).init();

      this.$refs.exhibitionName.innerText = exhibition.getName();
      this.$refs.exhibitionInformation.innerText = exhibition.getInformation();
      this.drawer_height = this.$refs.drawer.$el.clientHeight;
      this.$refs.drawer.$el.style.setProperty(
        "bottom",
        `${this.drawer_height / 3}px`
      );
    },
    // async searchExhibition (keyword) {
    //     let keyword_except_blank = keyword
    //     while (keyword_except_blank.includes(' ')) {
    //         keyword_except_blank = keyword_except_blank.replace(' ', '')
    //     }

    //     const MAX_EXHIBITION_NUMBER = 1000
    //     let whole_exhibition_pageId_list = await getExhibitionsOnArea('\%\%', 0, MAX_EXHIBITION_NUMBER)
    //     let result_exhibition_object_list = new Array()
    //     let coordinate_sum = new Object()
    //     coordinate_sum.latitude = 0
    //     coordinate_sum.longitude = 0

    //     let i = 0
    //     for (i = 0; i < whole_exhibition_pageId_list.length; i++) {
    //         let pageId = whole_exhibition_pageId_list[i]
    //         let exhibition = await new Exhibition(pageId).init()
    //         let exhibition_name = exhibition.getName()

    //         while (exhibition_name.includes(' ')) {
    //             exhibition_name = exhibition_name.replace(' ', '')
    //         }

    //         if (exhibition_name.match(new RegExp(keyword_except_blank, "i")) !== null) {
    //             let coordinate = await exhibition.getLocation()
    //             coordinate_sum.latitude += parseFloat(coordinate.latitude)
    //             coordinate_sum.longitude += parseFloat(coordinate.longitude)

    //             let object = new Object()
    //             object.pageId = pageId
    //             object.coordinate = coordinate
    //             result_exhibition_object_list.push(object)
    //         }
    //     }
    //     // 임시 프론트 구간
    //         let exhibition_list = [
    //             ...this.uljiro_exhibition_list,
    //             ...this.seongbuk_exhibition_list,
    //             ...this.uljiro_exhibition_list,
    //             ...this.seongbuk_exhibition_list,
    //             ...this.mapo_exhibition_list,
    //             ...this.bukcheon_exhibition_list,
    //             ...this.insadong_exhibition_list,
    //             ...this.pyeongchangdong_exhibition_list,
    //             ...this.gwanghwamun_exhibition_list,
    //             ...this.seochon_exhibition_list
    //         ]
    //         for (let i = 0; i < exhibition_list.length; i++) {
    //             let exhibition_name = exhibition_list[i].name
    //             while (exhibition_name.includes(' ')) {
    //                 exhibition_name = exhibition_name.replace(' ', '')
    //             }

    //             if (exhibition_name.match(new RegExp(keyword_except_blank, "i")) !== null) {
    //                 let coordinate = exhibition_list[i].coordinate
    //                 coordinate_sum.latitude += parseFloat(coordinate.latitude)
    //                 coordinate_sum.longitude += parseFloat(coordinate.longitude)

    //                 let object = new Object()
    //                 object.pageId = null
    //                 object.coordinate = coordinate
    //                 object.name = exhibition_name
    //                 object.introduction = exhibition_list[i].introduction
    //                 object.date = exhibition_list[i].date
    //                 object.time = exhibition_list[i].time
    //                 object.place = exhibition_list[i].place
    //                 object.link = exhibition_list[i].place
    //                 result_exhibition_object_list.push(object)
    //             }
    //         }
    //     // 임시 프론트 구간

    //     if (result_exhibition_object_list.length === 0) {
    //         this.no_result = true
    //         return
    //     }
    //     let mean_latitude = coordinate_sum.latitude / result_exhibition_object_list.length
    //     let mean_longitude = coordinate_sum.longitude / result_exhibition_object_list.length

    //     this.setMapCenter(mean_latitude, mean_longitude)
    //     this.setMarkers(result_exhibition_object_list)
    //     this.no_result = false
    // }
  },
};
</script>
<style lang="scss" scoped src="../scss/MapPage/mapPage.scss"></style>
