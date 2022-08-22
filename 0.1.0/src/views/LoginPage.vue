<template>
    <div id="loginPage">
        <div class="frontImage">
            <img src="@/assets/seek_logo.png">
            <div class="catchPhrase">
                취향에 딱 맞는
                <br/>
                <b>아트워크를 아카이빙</b>하세요
            </div>
        </div>
        <div class="kakaoLogin">
            <button class="loginButton" @click="loginWithKakao">
                <svg width="35" height="32" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0508 0C20.1336 0 22.9849 0.599991 25.6047 1.79997C28.2245 2.99995 30.2956 4.6317 31.818 6.69516C33.3404 8.75855 34.1016 11.0093 34.1016 13.4474C34.1016 15.8854 33.3404 18.1394 31.818 20.2092C30.2956 22.279 28.2277 23.9139 25.6142 25.1139C23.0008 26.3138 20.1463 26.9139 17.0508 26.9139C16.0739 26.9139 15.0653 26.844 14.025 26.7043C9.50857 29.8408 7.10452 31.4281 6.81272 31.4661C6.67315 31.5169 6.53991 31.5105 6.41306 31.4471C6.3623 31.409 6.32426 31.3582 6.29887 31.2947C6.27349 31.2312 6.26084 31.1741 6.26084 31.1233V31.0471C6.33698 30.5518 6.91418 28.4884 7.99256 24.8567C5.54404 23.6377 3.59982 22.0219 2.15989 20.0092C0.719965 17.9966 0 15.8093 0 13.4474C0 11.0093 0.761196 8.75855 2.28359 6.69516C3.80598 4.6317 5.87706 2.99995 8.49684 1.79997C11.1166 0.599991 13.9679 0 17.0508 0Z" fill="black"/>
                    </svg>
                <div>
                    카카오 계정으로 시작하기
                </div>
            </button>
            <div class="agreement">
                위 버튼을 클릭하면 SEEK의 
                <a href="https://shadow-tomato-af9.notion.site/958f54f9aed14a218e2b4bb73f3ea05f">서비스 이용 약관</a>과
                <br/>
                <a href="https://shadow-tomato-af9.notion.site/46a598266819471c94f64eb62c4b8ed1">개인정보 취급방침</a>에 동의하게 됩니다.
            </div>
        </div>
    </div>
</template>
<script>
    import { useCookies } from 'vue3-cookies'

    export default {
        name: 'LoginPage',
        components: {},
        setup() {
            const { cookies } = useCookies()
            return { cookies }
        },
        data() {
            return {
                redirect: (this.$route.query.redirect) 
                    ? this.$route.query.redirect
                    : '/'
            }
        },
        methods: {
            loginWithKakao () {
                const params = new URLSearchParams({
                    provider: "kakao",
                });
                Kakao.Auth.authorize({
                    redirectUri: process.env.VUE_APP_BASE_URL + '/auth?' + params.toString(),
                    state: this.redirect
                })
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/LoginPage/loginPage.scss"></style>