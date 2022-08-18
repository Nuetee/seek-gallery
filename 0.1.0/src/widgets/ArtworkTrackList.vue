<template>
    <div class="artworkTrackList">
        <ArtworkTrack v-for="(track, i) in this.track_array" :key="i" :track="track" :track_number="i.toString()"
            @track_loaded="this.getTrackListHeight()"></ArtworkTrack>
        <DotScrollBar :position_array="this.position_array" :height="this.track_list_height" :position="this.track_list_position"></DotScrollBar>
    </div>
</template>
<script>
    import ArtworkTrack from '@/widgets/ArtworkTrack.vue'
    import DotScrollBar from './DotScrollBar.vue';
    export default {
        name: 'ArtworkTrackList',
        components: {
            ArtworkTrack,
            DotScrollBar,
        },
        props: {
            artwork_track_list: {
                type: Array,
                default: []
            },
            category_list: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                track_total_number: 0,
                track_list_height: null,
                track_list_position: null,
            };
        },
        computed: {
            track_array () {
                if (this.artwork_track_list.length === 0 || this.category_list.length === 0) {
                    return new Array(0)
                }
                else {
                    let track_array = new Array(this.artwork_track_list.length)

                    for (let i = 0; i < track_array.length; i++) {
                        let track = new Object()

                        track.category = (this.category_list[i] ? this.category_list[i] : null)
                        track.artwork = this.artwork_track_list[i]
                        
                        track_array[i] = track
                    }

                    return track_array
                }
            },
            position_array () {
                if (this.artwork_track_list.length === this.category_list.length) {
                    return this.category_list
                }
                else {
                    let position_array = new Array(this.artwork_track_list.length)

                    for (let i = 0; i < position_array.length; i++) {
                        position_array[i] = this.category_list[i] ? this.category_list[i] : null
                    }

                    return position_array
                }
            }
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
            getTrackListHeight() {
                this.track_total_number += 1
                if (this.track_total_number !== this.artwork_track_list.length){
                    return
                }

                this.track_list_height = parseInt(document.getElementsByClassName('artworkTrackList')[0].clientHeight)
                this.track_list_position = parseInt(document.getElementsByClassName('artworkTrackList')[0].getBoundingClientRect().top)
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkTrackList.scss"></style>