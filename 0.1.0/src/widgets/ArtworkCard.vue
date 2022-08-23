<template>
    <div class="artworkCard" v-if="this.loadFlag" @click="this.redirectMain">
        <ArtworkImageContainer :image-src="this.cardImage" :ownClass="this.ownClass"></ArtworkImageContainer>
        <ArtworkInfo :exhibition="this.exhibition" :artwork="this.artwork"></ArtworkInfo>
    </div>
</template>
<script>
    import ArtworkImageContainer from './ArtworkImageContainer.vue';
    import ArtworkInfo from './ArtworkInfo.vue';
    import { Artwork } from '@/classes/artwork';
    import { Exhibition } from '@/classes/exhibition';

    export default {
        name: 'ArtworkCard',
        components: {
            ArtworkImageContainer,
            ArtworkInfo
        },
        props: {
            artworkId: {
                type: String,
                default: null
            },
            exhibitionId: {
                type: String,
                default: null
            },
            ownClass: String
        },
        data() {
            return {
                artwork: null,
                artworkInfo: null,
                exhibition: null,
                cardImage: '',
                loadFlag: false
            };
        },
        beforeCreate() {},
        async created() {
            if (this.artworkId) {
                const artwork = await new Artwork(this.artworkId).init()
                this.artwork = artwork
                this.cardImage = await this.artwork.getThumbnailImage()
            }
            else if(this.exhibitionId){
                const exhibition = await new Exhibition(this.exhibitionId).init()
                this.exhibition = exhibition
                this.cardImage = await this.exhibition.getThumbnailImage()
            }

            this.loadFlag = true
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            redirectMain () {
                const _this = this
                if (this.artworkId) {
                    this.$router.push({
                        path: '/artwork',
                        query: {
                            id: _this.artworkId
                        }
                    })
                }
                else if (this.exhibitionId) {
                    this.$router.push({
                        path: '/',
                        query: {
                            id: _this.exhibitionId
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkCard.scss"></style>