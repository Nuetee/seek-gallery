<template>
    <div :class="[this.ownClass, 'artworkImageContainer']">
        <img v-show="!this.firstResize" :src="this.imageSrc" :style="this.artworkImageStyle">
    </div>
</template>
<script>
    import { cropImage } from '@/modules/image.js'

    export default {
        name: 'ArtworkImageContainer',
        props: {
            // initialRatio: {
            //     type: Number,
            //     default : 0.6
            // },
            ownClass: String,
            imageSrc: String
        },
        data() {
            return {
                artworkImageStyle: '',
                firstResize: true,
            };
        },
        // async created () {
        //     this.artworkImageStyle = await cropImage(this.imageSrc, this.initialRatio)
        // },
        mounted () {
            const _this = this;

            const observer = new ResizeObserver(async entries => {
                for (let entry of entries) {
                    const cr = entry.contentRect;
                    let ratio = cr.width / cr.height;
                    await _this.setArtworkImageStyle(ratio)
                }
            })

            let artworkImageContainer = document.getElementsByClassName(this.ownClass)[0]
            observer.observe(artworkImageContainer, {box : 'content-box'});
        },
        methods: {
            loaded(event) {
                console.log(event)
            },
            async setArtworkImageStyle (ratio) {
                if (this.firstResize) {
                    this.firstResize = false;
                    let artworkImageContainer = document.getElementsByClassName(this.ownClass)[0]
                    setTimeout(function () {
                        artworkImageContainer.style.opacity = 1
                    }, 100)
                    
                }
                this.artworkImageStyle = await cropImage(this.imageSrc, ratio)
            },
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/artworkImageContainer.scss"></style>