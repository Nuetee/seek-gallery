<template>
  <router-view/>
</template>
<script>
  export default {
    name: 'App',
    created () {
      this.setVwVh()
      window.addEventListener('resize', this.setVwVh)

      // Kakao SDK initialization
      Kakao.init('26b87aab90f717f43d0f8c22cb55c629')
    },
    methods: {
      setVwVh () {
        let screenHeight = window.innerHeight;
        let vh = screenHeight * 0.01

        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let screenWidth = window.innerWidth;
        if (screenWidth >= 768) {
          let vw = 480 * 0.01;
          document.documentElement.style.setProperty('--vw', `${vw}px`);
        }
        else {
          let vw = screenWidth * 0.01;
          document.documentElement.style.setProperty('--vw', `${vw}px`);
        }
      }
    }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap');

:root {
  --vw: 1vw;
  --vh: 1vh;
  --padding: calc(var(--vw, 1vw) * 5);
}

html,
body {
  // ios safari scroll bouncing 막기 => address bar shrink 안됨.
  // position: fixed;
  // overflow: hidden;
  // ios safari scroll bouncing 막기
  
  // 탭 할 때 하이라이트 컬러 없애기
  -webkit-tap-highlight-color: rgba($color: #000000, $alpha: 0.0);
}

body {
  width: 100vw;
  min-height: 0 !important;
  overflow: scroll;
  display: flex;
  justify-content: center;
}

body::-webkit-scrollbar {
  display: none;
  height: 0;
  background: transparent;
  -webkit-appearance: none;
}

#app::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera*/
  // 스크롤바 잔상 없애기
  height: 0;
  background: transparent;
  /* Optional: just make scrollbar invisible */
  -webkit-appearance: none;
}

#app {
  font-family: 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: scroll;

  > div[id$="Page"] {
    width: calc(var(--vw, 1vw) * 100);
    padding-left: var(--padding, 5vw);
    padding-right: var(--padding, 5vw);
    box-shadow: 0 0 calc(var(--vw, 1vw) * 3) rgba(128, 128, 128, 0.1);
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }

  > img[src$=".jpg"] {
    image-rendering: -moz-crisp-edges;
    /* Firefox */
    image-rendering: -o-crisp-edges;
    /* Opera */
    image-rendering: -webkit-optimize-contrast;
    /* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
    /* IE (non-standard property) */
  }
}

.poppins {
  font-family: 'Poppins', sans-serif;
}

a:visited {
  text-decoration: none;
  color: black;
}

a {
  text-decoration: none;
  color: black;
}

.slide-enter-active {
  transition: all 1s ease-out;
}

.slide-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(calc(var(--vw, 1vw) * 100));
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-list-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-list-enter-from,
.slide-fade-list-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
