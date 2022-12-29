<template>
    <div class="subPageMy">
        <div class="profile">
            <RoundProfile v-if="this.user_flag" :profile="this.user ? this.user.getProfile() : null"></RoundProfile>
            <div class="name">
                {{ this.user.getNickname() }}
            </div>
        </div>
        <div class="sortingStrategyTab">
            <svg class="doubleColumnStrategy sortingStrategy" @click="this.setSortingStrategy($event)" width="14" height="14"
                viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="6.30695" height="6.30695" rx="2" />
                <rect y="7.45361" width="6.30695" height="6.30695" rx="2" />
                <rect x="7.45361" width="6.30695" height="6.30695" rx="2" />
                <rect x="7.45361" y="7.45361" width="6.30695" height="6.30695" rx="2" />
            </svg>
            <svg class="singleColumnStrategy" @click="this.setSortingStrategy($event)" width="14" height="14" viewBox="0 0 14 14"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="6" rx="2" />
                <rect y="8" width="14" height="6" rx="2" />
            </svg>
        </div>
    </div>
    <List :is_artwork="true" :single_column="this.is_single_column"></List>
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
                user_flag: false,
                is_single_column: false,
                archived_list: [],
                nothingToUpdate: false
            };
        },
        beforeCreate() {},
        async created() {
            if (isAuth()) {
                this.user = getAuth()
                // await user.putUserSession()
                await this.rebuild(0, 12)
                this.user_flag = true
            }
            else {
                
            }

        },
        beforeMount() {},
        mounted() {},
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
                this.archived_list = this.archived_list.concat(newArchiveList)
                if (newArchiveList.length < 12) {
                    this.nothingToUpdate = true
                }
            },
            async load() {
                if (!this.nothingToUpdate) {
                    await this.rebuild(this.archived_list.length, 12)
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/subPageMy.scss"></style>