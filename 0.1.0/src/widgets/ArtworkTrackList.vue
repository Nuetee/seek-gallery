<template>
    <div class="artworkTrackList">
        <div class="artworkTrackListContainer" ref="artworkTrackListContainer">
            <div class="artworkTrackContainer" v-for="(category, i) in this.category_list">
                <div class="tracksIncategory">
                    <div class="category">{{ category }}</div>
                    <div v-for="(track, j) in this.artwork_track_list[i]" :key="j" class="track" @click="this.redirectArtworkPage(i, j)">
                        <div class="artwork">
                            <div class="artworkThumbnail">
                                <div class="imageContainer">
                                    <img class="thumbnailImage" :src="track.thumbnail" :style="track.style">
                                </div>
                            </div>
                            <div class="artworkInformation">
                                <div class="artworkName poppins">{{ track.getName() }}</div>
                                <div class=" artist">{{ track.getArtistName() }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DotScrollBar
            :basis_element_id="'viewPort'"
            :scroll_basis_element_id="'body'"
            :scroll_element_class="'artworkTrackListContainer'"
            :category_list="this.category_list" 
            :artwork_track_list="this.artwork_track_list"
            :contents_height="this.contents_height"
        ></DotScrollBar>
    </div>
</template>
<script>
    import { cropImage } from '@/modules/image'
    import DotScrollBar from './DotScrollBar.vue'

    export default {
        name: 'ArtworkTrackList',
        components: { DotScrollBar },
        props: {
            //source: String,
            prop_category_list: Array,
            prop_artwork_track_list: Array,
        },
        watch: {
            'prop_category_list': {
                prop_category_list: true,
                handler () {
                    this.category_list = this.prop_category_list.slice()
                    this.contents_height = this.$refs.artworkTrackListContainer.clientHeight
                }
            },
            'prop_artwork_track_list': {
                deep: true,
                async handler() {
                    this.artwork_track_list = this.prop_artwork_track_list.map(v => v.slice())
                    this.artwork_track_list.forEach(async (value) => {
                        value.forEach(async (artwork, index) => {
                            artwork.thumbnail = await artwork.getThumbnailImage()
                            artwork.style = await cropImage(artwork.thumbnail, 1)
                        })
                    })
                    this.contents_height = this.$refs.artworkTrackListContainer.clientHeight
                }
            },
        },
        data() {
            return {
                category_list: null,
                artwork_track_list: null,
                contents_height: null
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            redirectArtworkPage (category_index, artwork_index) {
                let track_page_id_array = new Array(0)
                let artwork_page_index = 0
                let artwork_count = 0
                this.artwork_track_list.forEach((value, index) => {
                    value.forEach((artwork, index_2) => {
                        track_page_id_array.push(artwork.getPageID())

                        if (index == category_index && index_2 == artwork_index) {
                            artwork_page_index = artwork_count
                        }
                        artwork_count++
                    })
                })
                if (process.env.NODE_ENV === 'production') {
                    this.$gtag.event('click', {
                        event_category: 'exhibition',
                        event_label: 'enter',
                        value: this.artwork_track_list[category_index][artwork_index].getID()
                    })
                }
                this.$router.push({
                    path: '/artwork',
                    query: {
                        array: track_page_id_array,
                        index: artwork_page_index
                    }
                })
            }
            
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkTrackList.scss"></style>