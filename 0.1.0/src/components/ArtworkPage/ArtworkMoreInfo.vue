<template>
    <div class="artworkMoreInfo normal">
        <div class="label">설명</div>
        <div class="content">
            {{ this.information }}
            <br /><br />
            <div v-if="this.price !== ''"> <b> {{ this.price }} </b> </div>
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
                price: '',
                showMoreButton: false
            };
        },
        created() {
            const data = this.artwork.getInformation().split('\n')
            
            const formatter = new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
            })

            this.information = data[0]
            this.price = (data[1]) ? formatter.format(data[1]) : ''
        },
        mounted() {
            const oberver = new ResizeObserver(async entries => {
                const el = entries[0].target;
                if (el.clientHeight < el.scrollHeight) {
                    el.classList.add('opacity-gradient')
                }
                else {
                    el.classList.remove('opacity-gradient')
                }
            })

            let content = document.getElementsByClassName('content')[0]
            oberver.observe(content, { box: 'content-box' });
        },
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkMoreInfo.scss"></style>