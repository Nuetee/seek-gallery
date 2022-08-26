<template>
    <div class="artworkMoreInfo normal">
        <div class="label">설명</div>
        <div class="content">
            <div class="information">
                {{ this.artwork ? this.artwork.getInformation() : '' }}
            </div>
            <div class="overflowEffect"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkMoreInfo',
        components: {},
        props: {
            artwork: Object
        },
        data() {
            return {
                information: '',
                showMoreButton: false,
                overflowEffect: null
            };
        },
        created() {
        },
        mounted() {
            const oberver = new ResizeObserver(async entries => {
                const el = entries[0].target;
                if (el.clientHeight < el.scrollHeight) {
                    this.overflowEffect.classList.add('opacity-gradient')
                }
                else {
                    this.overflowEffect.classList.remove('opacity-gradient')
                }
            })
            
            this.overflowEffect = document.getElementsByClassName('overflowEffect')[0]
            let content = document.getElementsByClassName('content')[0]
            oberver.observe(content, { box: 'content-box' });
        },
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkMoreInfo.scss"></style>