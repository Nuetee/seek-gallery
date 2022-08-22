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
                        {{this.nickname}}
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
                            <router-link :to="'/mypage'" replace>
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
</template>
<script>
    import RoundProfile from './RoundProfile.vue';
    import { 
        isAuth, 
        getAuth,
        logout
    } from '@/modules/auth';

    export default {
        name: '',
        components: {RoundProfile},
        props: {
            minimized: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
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
        beforeCreate() {},
        created() {
            if (isAuth()) {
                const user = getAuth()
                this.nickname = user.getNickname()
                this.userId = user.getPageID()
                this.userThumbnail = user.getThumbnail()
            }
            this.userThumbnailLoadFlag = true
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            logOut () {
                if(!isAuth()) {
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