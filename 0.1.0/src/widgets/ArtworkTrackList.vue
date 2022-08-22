<template>
    <div class="artworkTrackList">
        <DotScrollBar :position_array="this.position_array" :contents_height="this.track_list_height"
            :contents_top_position="this.track_list_position">
        </DotScrollBar>
        <div class="artworkTracksContainer">
            <ArtworkTrack v-for="(track, i) in this.track_array" :key="i" :track="track" :track_number="i.toString()"
                @track_loaded="this.getTrackListProperty()"></ArtworkTrack>
        </div>
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
            },
            proper_position_flag: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                track_total_number: 0,
                track_list_height: null,
                track_list_position: null,
            };
        },
        watch: {
            proper_position_flag () {
                this.getTrackListProperty(0)
            }
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
            getTrackListProperty(track_load_number = 1) {
                // proper_position_flag 값 변화(false -> true)에 의해 호출된 경우
                if (this.proper_position_flag) {
                    this.track_list_position = parseInt(document.getElementsByClassName('artworkTrack 0')[0].getBoundingClientRect().top + window.scrollY)
                }
                // artworkTrack들의 load event 수신자로써 호출된 경우
                else {
                    this.track_total_number += track_load_number
                    if (this.track_total_number === this.artwork_track_list.length) {
                        this.track_list_height = parseInt(document.getElementsByClassName('artworkTracksContainer')[0].clientHeight)

                        document.getElementsByClassName('artworkTrackList')[0].style.setProperty('height', `${document.getElementsByClassName('artworkTrackList')[0].clientHeight + this.track_list_height}px`)
                    }
                }
                
                return
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkTrackList.scss"></style>