<template>
    <div id="myPage">
        <div class="top">
            <button class="logo">
                <img src="@/assets/seek_logo.png">
            </button>
            <button class="myMenu" @click="this.openSideBar($event)">
                <svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="1.5" rx="0.75" fill="black" />
                    <rect y="21" width="30" height="1.5" rx="0.75" fill="black" />
                    <rect y="10.5" width="30" height="1.5" rx="0.75" fill="black" />
                </svg>
            </button>
        </div>
        <div class="middle">
            <ProfileContainer></ProfileContainer>
            <ProfileShareButton></ProfileShareButton>
        </div>
        <div class="bottom">
            <MyTab ref="myTab"></MyTab>
        </div>
        <SideBar :minimized="this.minimized"></SideBar>
        <div class="background" :style="this.setBackground()" @click="this.closeSideBar"></div>
    </div>
</template>
<script>
    import ProfileContainer from '@/components/MyPage/ProfileContainer.vue';
    import ProfileShareButton from '@/components/MyPage/ProfileShareButton.vue';
    import MyTab from '@/components/MyPage/MyTab.vue';
    import { isAuth, getAuth } from '@/modules/auth';
    import SideBar from '@/widgets/SideBar.vue';

    export default {
        name: 'MyPage',
        components: { 
            ProfileContainer, 
            ProfileShareButton, 
            MyTab,
            SideBar
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
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응
                
                window.history.pushState(null, '', location.href)
                this.minimized = false
            },
            closeSideBar () {
                if (!this.minimized) {
                    window.history.back()
                    this.minimized = true
                }
            },
            setBackground() {
                if (this.minimized) {
                    return 'display: none'
                }
                else return
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MyPage/myPage.scss"></style>