<template>
    <div id="myPage">
        <MainHeader :background_color="'white'">
            <template v-slot:left>
                <img src="../assets/seek_logo.png">
            </template>
            <template v-slot:right>
                <svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg" @click="this.openSideBar($event)">
                    <rect width="30" height="1.5" rx="0.75" fill="black" />
                    <rect y="21" width="30" height="1.5" rx="0.75" fill="black" />
                    <rect y="10.5" width="30" height="1.5" rx="0.75" fill="black" />
                </svg>
            </template>
        </MainHeader>
        <div class="top">
            <ProfileContainer></ProfileContainer>
            <ProfileShareButton></ProfileShareButton>
        </div>
        <div class="bottom">
            <MyTab ref="myTab"></MyTab>
        </div>
        <SideBar ref="sideBar"></SideBar>
    </div>
</template>
<script>
    import ProfileContainer from '@/components/MyPage/ProfileContainer.vue';
    import ProfileShareButton from '@/components/MyPage/ProfileShareButton.vue';
    import MyTab from '@/components/MyPage/MyTab.vue';
    import { isAuth, getAuth } from '@/modules/auth';
    import SideBar from '@/widgets/SideBar.vue';
    import MainHeader from '@/widgets/MainHeader.vue';

    export default {
        name: 'MyPage',
        components: {
            ProfileContainer,
            ProfileShareButton,
            MyTab,
            SideBar,
            MainHeader
        },
        data() {
            return {
                minimized: true
            };
        },
        beforeCreate() {},
        async created() {
            const _this = this
            window.onpopstate = function(event) {
                if(_this.minimized == false) {
                    _this.minimized = true
                }
            }

            // Update session
            if(isAuth()) {
                const user = getAuth()
                await user.putUserSession()
            }

            // Scroll Listener
            document.getElementById('myPage').addEventListener('scroll', async function (event) {
                const scroll_height = event.target.scrollHeight
                const scroll_top = event.target.scrollTop
                const offset_height = event.target.offsetHeight
                if (scroll_height === scroll_top + offset_height) {
                    await _this.$refs.myTab.load()
                }
            })
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/MyPage/myPage.scss"></style>