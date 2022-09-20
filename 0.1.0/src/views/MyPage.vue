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
        <va-infinite-scroll :load="this.load">
            <div class="bottom">
                <MyTab ref="myTab"></MyTab>
            </div>
        </va-infinite-scroll>
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
                minimized: true,
                main_header_element: null,
                vw: null
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
                const scroll_top = event.target.scrollTop
                
                if (_this.main_header_element === null) {
                    console.log('Failed to get dom elements.')
                    return
                }
                
                let header_scale = (scroll_top/_this.vw > 10) ? (0.7) : (1 - (scroll_top / (_this.vw * 10)) * 0.3)
                _this.main_header_element.style.setProperty('transform', `translate(-50%, 0) scaleY(${header_scale})`)

                for (let i = 0; i < _this.main_header_element.children.length; i++) {
                    _this.main_header_element.children[i].style.setProperty('transform', `scaleX(${header_scale})`)
                }

            })
        },
        beforeMount() {},
        mounted() {
            this.vw = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", ""))
            this.main_header_element = document.getElementsByClassName('mainHeader')[0]
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            openSideBar (event) {
                this.$refs.sideBar.openSideBar(event)
            },
            async load () {
                await this.$refs.myTab.load()
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MyPage/myPage.scss"></style>