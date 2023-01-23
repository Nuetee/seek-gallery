<template>
    <div class="subPageMy" v-if="this.user !== null">
        <div class="top">
            <div class="profile">
                <RoundProfile v-if="this.user_flag" :profile="this.user ? this.user.getProfile() : null" ref="roundProfile">
                </RoundProfile>
                <div class="myName">
                    {{ this.user.getNickname() }}
                </div>
            </div>
            <div class="sortingStrategyTab">
                <div class="loving">Loving</div>
                <svg class="doubleColumnStrategy sortingStrategy" @click="this.setSortingStrategy($event)" width="14" height="14"
                    viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="6.30695" height="6.30695" rx="2" />
                    <rect y="7.45361" width="6.30695" height="6.30695" rx="2" />
                    <rect x="7.45361" width="6.30695" height="6.30695" rx="2" />
                    <rect x="7.45361" y="7.45361" width="6.30695" height="6.30695" rx="2" />
                </svg>
                <svg class="singleColumnStrategy" @click="this.setSortingStrategy($event)" width="14" height="14"
                    viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="14" height="6" rx="2" />
                    <rect y="8" width="14" height="6" rx="2" />
                </svg>
            </div>
        </div>
        <div class="bottom">
            <List 
                :is_artwork="true" 
                :single_column="this.is_single_column" 
                :id_list="this.archived_list"
                :list_id="'archivedArtworkList'"
                @load-complete="(is_loaded) => {this.load_flag = !is_loaded}"
            >
            </List>
        </div>
    </div>
    <div class="toLogin" v-else>
        <div class="phrase">로그인하면<br>MY페이지를 볼 수 있어요!</div>
        <div class="loginButton" @click="this.logIn()">로그인</div>
    </div>
</template>
<script>
    import RoundProfile from '@/widgets/RoundProfile.vue';
    import List from '@/widgets/List.vue';
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'
    
    export default {
        name: 'SubPageMy',
        components: {
            RoundProfile,
            List
        },
        data() {
            return {
                user: null,
                profile: null,
                is_profile_shrink: false,
                user_flag: false,
                is_single_column: false,
                archived_list: [],
                nothingToUpdate: false,
                load_flag: false,
                update_in_progress: false
            };
        },
        beforeCreate() {},
        created() {
        },
        beforeMount() {},
        async mounted() {
            if (isAuth()) {
                this.user = getAuth()
                await this.rebuild(0, 10)
                this.user_flag = true
                let bottom = document.getElementsByClassName('bottom')[0]
                const _this = this
                bottom.addEventListener('scroll', async function (event) {
                    _this.swiperSlideScrollEventFunction(event.currentTarget)
                })
            }
            else {
                this.user = null
            }
            
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            setSortingStrategy(event) {
                if (event.currentTarget.classList.contains('sortingStrategy')) {
                    return
                }

                event.currentTarget.classList.add('sortingStrategy')

                let is_single_column = event.currentTarget.classList.contains('singleColumnStrategy')

                if (is_single_column) {
                    document.getElementsByClassName('doubleColumnStrategy')[0].classList.remove('sortingStrategy')
                }
                else {
                    document.getElementsByClassName('singleColumnStrategy')[0].classList.remove('sortingStrategy')
                }

                this.is_single_column = is_single_column
                return
            },
            async rebuild(offset, length) {
                const newArchiveList = await this.user.getArchiveArtworks(offset, length)
                if (newArchiveList.length === 0) {
                    return
                }
                this.archived_list = this.archived_list.concat(newArchiveList)
                if (newArchiveList.length < 10) {
                    this.nothingToUpdate = true
                }
                return
            },
            async load() {
                if (this.load_flag) {
                    return false
                }

                if (!this.nothingToUpdate) {
                    this.load_flag = true
                    await this.rebuild(this.archived_list.length, 10)
                }
            },
            async swiperSlideScrollEventFunction(targetElement) {
                const scroll_height = targetElement.scrollHeight
                const scroll_top = targetElement.scrollTop
                const offset_height = targetElement.offsetHeight

                if (scroll_top > 5) {
                    this.shrinkProfileHeight(true)
                }
                else {
                    this.shrinkProfileHeight(false)
                }

                if (scroll_height === scroll_top + offset_height) {
                    await this.load()
                }
            },
            shrinkProfileHeight(is_shrink) {
                if (is_shrink) {
                    if (this.is_profile_shrink) return
                    this.$refs.roundProfile.$el.style.setProperty('height', '0')
                    this.$refs.roundProfile.$el.style.setProperty('width', '0')
                    document.getElementsByClassName('myName')[0].style.setProperty('height', '0')
                    document.getElementsByClassName('profile')[0].style.setProperty('padding-top', '0')
                    document.getElementsByClassName('profile')[0].style.setProperty('gap', '0')
                    this.is_profile_shrink = true
                }
                else {
                    let vw = window.innerWidth * 0.01
                    if (window.innerWidth >= 768) {
                        vw = 4.8
                    }

                    let height = vw * 24
                    this.$refs.roundProfile.$el.style.setProperty('height', `${height}px`)
                    this.$refs.roundProfile.$el.style.setProperty('width', `${height}px`)
                    document.getElementsByClassName('myName')[0].style.setProperty('height', `${vw * 7.5}px`)
                    document.getElementsByClassName('profile')[0].style.setProperty('padding-top', `${vw * 2.6}px`)
                    document.getElementsByClassName('profile')[0].style.setProperty('gap', `${vw * 2.6}px`)
                    this.is_profile_shrink = false
                }
            },

            logIn() {
                this.$router.replace({
                    path: '/login',
                    query: {
                        redirect: this.$route.fullPath
                    }
                })
                return
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/subPageMy.scss"></style>