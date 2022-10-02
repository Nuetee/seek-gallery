<template>
    <div class="shareButton">
        <svg @click="this.share($event)" width="38" height="38" viewBox="0 0 38 38" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M33.3364 21.7637V28.097C33.3364 28.9369 33.0028 29.7423 32.4089 30.3362C31.8151 30.93 31.0096 31.2637 30.1698 31.2637H8.00309C7.16324 31.2637 6.35779 30.93 5.76392 30.3362C5.17006 29.7423 4.83643 28.9369 4.83643 28.097V21.7637"
                :stroke="(this.color === 'black') ? '#000' : '#fff'" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            <path d="M27.003 10.6803L19.0863 2.76367L11.1697 10.6803"
                :stroke="(this.color === 'black') ? '#000' : '#fff'" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            <path d="M19.0864 2.76367V21.7637" :stroke="(this.color === 'black') ? '#000' : '#fff'" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
</template>
<script>
    export default {
        name: 'ShareButton',
        components: {},
        props: {
            color: String,
            artwork: Object
        },
        data() {
            return {
                sampleData: ''
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
            share (event) {
                // 이벤트 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응

                let shareTitle = this.artwork.getName()
                let shareText = this.artwork.getArtistName() + ' ' + this.artwork.getName()
                let shareUrl = 'https://se-ek.com/artwork?array=' + this.artwork.getPageID() + '&index=0'

                if (navigator.share) {
                    navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: shareUrl
                    })
                    .then(function () {
                        if (process.env.NODE_ENV === 'production') {
                            this.$gtag.event('click', {
                                event_category: 'artwork',
                                event_label: 'share',
                                value: this.artwork.getID()
                            })
                        }
                    })
                    .catch(error => console.log('Error sharing', error))
                }
                else {
                    let textarea = document.createElement("textarea")
                    document.body.appendChild(textarea)
                    textarea.value = shareUrl
                    textarea.select()
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    if (process.env.NODE_ENV === 'production') {
                        this.$gtag.event('click', {
                            event_category: 'artwork',
                            event_label: 'share',
                            value: this.artwork.getID()
                        })
                    }
                    alert("페이지 주소를 클립보드에 복사했습니다.")
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/shareButton.scss"></style>