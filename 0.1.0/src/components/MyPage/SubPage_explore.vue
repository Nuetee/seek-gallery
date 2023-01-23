<template>
    <div class="subPageExplore">
        <List 
            :single_column="false" 
            :is_artwork="true"
            :id_list="this.artwork_id_list"
            :list_id="'exploreList'"
            @load-complete="(is_loaded) => {this.load_flag = !is_loaded}"
        >
        </List>
    </div>
</template>
<script>
    import { getRandomArtworks } from '@/modules/public';
    import List from '@/widgets/List.vue';

    export default {
        name: 'SubPageExplore',
        components: {
            List
        },
        data() {
            return {
                seed: null,
                offset: 0,
                limit: 10,
                artwork_id_list: [],
                load_flag: false
            };
        },
        beforeCreate() {},
        async created() {
            // 0 ~ 999 까지의 난수 생성
            this.seed = Math.floor(Math.random() * 1000)
            // this.artwork_id_list = await getRandomArtworks(this.seed, this.offset, this.limit)
            // this.offset += this.limit
            await this.load()
        },
        beforeMount() {},
        mounted() {
            const _this = this
            let subPageExplore = document.getElementsByClassName('subPageExplore')[0]
            subPageExplore.addEventListener('scroll', async function () {
                const scroll_height = subPageExplore.scrollHeight
                const scroll_top = subPageExplore.scrollTop
                const offset_height = subPageExplore.offsetHeight
                
                if (scroll_height === scroll_top + offset_height) {
                    await _this.load()
                }
            })
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            async load() {
                if (this.load_flag) {
                    return false
                }
                this.load_flag = true
                await this.rebuild(this.artwork_id_list.length, 10)
            },
            async rebuild(offset, limit) {
                const newIdList = await getRandomArtworks(this.seed, offset, limit)
                if (newIdList.length === 0) {
                    return
                }
                this.artwork_id_list = this.artwork_id_list.concat(newIdList)
                return
            },
        }
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/subPageExplore.scss"></style>