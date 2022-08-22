<template>
    <div v-if="this.isArtwork" class="artworkCardList">
        <div class="column1">
            <transition-group name="slide-fade" tag="div">
                <div v-for="(artworkId, i) in this.artworkIdList" :key="i">
                    <ArtworkCard v-if="i % 2 == 0" :artworkId="artworkId" :ownClass="this.tabClass + i.toString()"></ArtworkCard>
                </div>
            </transition-group>
        </div>
        <div class="column2">
            <transition-group name="slide-fade" tag="div">
                <div v-for="(artworkId, i) in this.artworkIdList" :key="i">
                    <ArtworkCard v-if="i % 2 == 1" :artworkId="artworkId" :ownClass="this.tabClass + i.toString()"></ArtworkCard>
                </div>
            </transition-group>
        </div>
    </div>
    <div v-else class="artworkCardList">
        <div class="column1">
            <transition-group name="slide-fade" tag="div">
                <div v-for="(exhibitionId, i) in this.exhibitionIdList" :key="i">
                    <ArtworkCard v-if="i % 2 == 0" :exhibitionId="exhibitionId" :ownClass="this.tabClass + i.toString()"></ArtworkCard>
                </div>
            </transition-group>
        </div>
        <div class="column2">
            <transition-group name="slide-fade" tag="div">
                <div v-for="(exhibitionId, i) in this.exhibitionIdList" :key="i">
                    <ArtworkCard v-if="i % 2 == 1" :exhibitionId="exhibitionId" :ownClass="this.tabClass + i.toString()"></ArtworkCard>
                </div>
            </transition-group>
        </div>
    </div>
</template>
<script>
    import ArtworkCard from './ArtworkCard.vue';

    export default {
        name: 'ArtworkCardList',
        components: {
            ArtworkCard
        },
        props: {
            artworkIdList: {
                type: Array,
                default: []
            },
            exhibitionIdList: {
                type: Array,
                default: []
            },
            tabClass: String
        },
        data() {
            return {
                isArtwork: this.artworkIdList.length > 0
            };
        },
        beforeCreate() {},
        created() {

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
<style lang="scss" scoped src="../scss/widgets/artworkCardList.scss"></style>