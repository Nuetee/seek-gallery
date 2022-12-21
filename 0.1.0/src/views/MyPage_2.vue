<template>
    <div id="myPage">
        <MainHeader>
            <template v-slot:left>
                <img src="../assets/seek_logo.png">
            </template>
            <template v-slot:right>
                <div class="tabs">
                    <div
                        class="tab"
                        v-for="tab, tab_index in ['MY', '탐색']"
                        :key="tab"
                        @click="this.clickTab(tab_index)"
                    >
                        {{ tab }}
                    </div>
                    <div class="tab_content"></div>
                </div>
            </template>
        </MainHeader>
        <div class="subPages">
            <SubPageMy></SubPageMy>
        </div>
    </div>
</template>
<script>
    import MainHeader from '@/widgets/MainHeader.vue';
    import SubPageMy from '../components/MyPage/SubPage_my.vue'
    import SubPageSearch from '../components/MyPage/SubPage_search.vue'

    export default {
        name: 'MyPage',
        components: {
            MainHeader,
            SubPageMy,
            SubPageSearch
        },
        data() {
            return {
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {
            document.getElementsByClassName('tab')[0].style.color = 'white'
            document.getElementsByClassName('tab')[1 - tab_index].style.color = 'black'
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            clickTab (tab_index) {
                document.getElementsByClassName('tab')[tab_index].style.color = 'white'
                document.getElementsByClassName('tab')[1 - tab_index].style.color = 'black'

                if (tab_index === 0) {
                    document.getElementsByClassName('tab_content')[0].style.left = 0
                    document.getElementsByClassName('tab_content')[0].style.transform = 'translate(0, 0)'
                }
                else {
                    document.getElementsByClassName('tab_content')[0].style.left = '100%'
                    document.getElementsByClassName('tab_content')[0].style.transform = 'translate(-100%, 0)'
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/MyPage/myPage_2.scss"></style>