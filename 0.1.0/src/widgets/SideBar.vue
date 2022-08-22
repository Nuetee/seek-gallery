<template>
    <div class="sideBarContainer">
        <va-sidebar class="sideBar" :minimized="minimized" color="white" textColor="black" position="right"
            minimizedWidth="0" style="position: absolute;">
            <va-sidebar-item active-color="black" hover-color="white">
                <va-sidebar-item-content>
                    <va-icon>
                        <RoundProfile v-if="this.userThumbnailLoadFlag" :profile="this.userThumbnail" />
                    </va-icon>
                    <va-sidebar-item-title>
                        {{ this.nickname }}
                        <div id="userId" v-if="this.userThumbnail !== ''">
                            {{ "user_" + this.userId }}
                        </div>
                    </va-sidebar-item-title>
                </va-sidebar-item-content>
            </va-sidebar-item>
            <div class="items">
                <va-sidebar-item active-color="black" hover-color="white">
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>
                            <router-link :to="'/'" replace>
                                {{ '마이페이지' }}
                            </router-link>
                        </va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>
                <va-sidebar-item active-color="black" hover-color="white">
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>
                            <a class="reportButton" :href="this.reportURL">
                                {{ '피드백' }}
                            </a>
                        </va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>
                <va-sidebar-item active-color="black" hover-color="white" @click="this.logOut">
                    <va-sidebar-item-content>
                        <va-sidebar-item-title v-if="this.userThumbnail !== ''">
                            {{ '로그아웃' }}
                        </va-sidebar-item-title>
                        <va-sidebar-item-title v-else>
                            {{ '로그인' }}
                        </va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>
            </div>
        </va-sidebar>
    </div>
    <Background :background_display="this.minimized" @click="this.popHistory"></Background>
</template>
<script>
    import RoundProfile from './RoundProfile.vue';
    import Background from './Background.vue';
    import {
        isAuth,
        getAuth,
        logout
    } from '@/modules/auth';

    export default {
        name: 'SideBar',
        components: { 
            Background,
            RoundProfile
        },
        data () {
            return {
                minimized: true,
                nickname: 'Guest',
                userId: '',
                userThumbnail: '',
                userThumbnailLoadFlag: false,
                items: [{
                    title: '마이페이지'
                }, {
                    title: '피드백'
                }],
                reportURL: 'https://forms.gle/CoJ7AShAUA3joVBQ9'
            };
        },
        created () {
            /*
            * - popstate 이벤트는 뒤로가기 (back button이나 history.back() 호출)시에 발생.
            * SideBar가 펼쳐진 상태(this.minimized == false)에서 뒤로가기 버튼을 누르면 closeSideBar()함수를 호출한다.
            */
            const _this = this
            window.onpopstate = function (event) {
                if (_this.minimized == false) {
                    _this.minimized = true
                    return
                }
            }

            if (isAuth()) {
                const user = getAuth()
                this.nickname = user.getNickname()
                this.userId = user.getPageID()
                this.userThumbnail = user.getThumbnail()
            }
            this.userThumbnailLoadFlag = true
        },
        methods: {
            /*
            * - sideBarOpenButton(class)에 click event가 발생하면 호출되는 함수.
            * 1. 부모 DOM Element로의 click event 전파를 차단한다.
            * 2. history.pushState() 메서드를 통해 브라우저의 세션기록에 더비 상태를 추가한다. (뒤로가기를 눌렀을 때, 이전 페이지로 이동하지 않도록 하기 위함.)
            * 3. this.minimized = false 로 설정하여 sideBar가 펼쳐지게 한다.
            */
            openSideBar(event) {
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응

                window.history.pushState(null, '', location.href)
                this.minimized = false
            },
            /*
            * - sideBar component가 접히도록 하는 함수.
            * 1. sideBar component에 props로 넘기는 data인 this.minimized == false인 경우, sideBar가 펼쳐져 있는 상태
            * 2. sideBar가 펼쳐진 상태에서 background를 터치한 경우라면 history.back() 메서드를 통해 뒤로가기 이벤트를 발생시킴.
            * 3. 뒤로가기 이벤트는 window.onpopstate를 발생시키고, 여기서 this.minimized = true로 바꿔줌.
            */
            popHistory() {
                if (!this.minimized) {
                    window.history.back()
                }
            },
            logOut() {
                if (!isAuth()) {
                    this.$router.replace({
                        path: '/login',
                        query: {
                            redirect: this.$route.fullPath
                        }
                    })
                    return
                }
                logout(this.$store.getters.getProvider)
                this.$router.go()
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/sideBar.scss"></style>