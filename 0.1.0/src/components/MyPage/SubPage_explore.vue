<template>
    <div class="subPageExplore">
        <List 
            :single_column="false" 
            :is_artwork="true"
            :id_list="this.artwork_id_list"
            :list_id="'exploreList'">
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
                limit: 30,
                artwork_id_list: null
            };
        },
        beforeCreate() {},
        async created() {
            // 0 ~ 999 까지의 난수 생성
            this.seed = Math.floor(Math.random() * 1000)
            this.artwork_id_list = await getRandomArtworks(this.seed, this.offset, this.limit)
            this.offset += this.limit
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/subPageExplore.scss"></style>