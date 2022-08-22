<template>
    <div class="snsLink">
        <a :href="this.artwork.getSNS()" @click="this.stopPropagation($event)">
            <svg v-if="this.color === 'white'" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M14.1667 1.66699H5.83332c-2.30118 0-4.16666 1.86548-4.16666 4.16667V14.167c0 2.3012 1.86548 4.1667 4.16666 4.1667h8.33338c2.3011 0 4.1666-1.8655 4.1666-4.1667V5.83366c0-2.30119-1.8655-4.16667-4.1666-4.16667Z"
                    stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M13.3333 9.47525c.1029.69355-.0156 1.40185-.3385 2.02415-.3229.6224-.8338 1.127-1.4601 1.4422-.6263.3153-1.336.425-2.0282.3136-.69222-.1114-1.33169-.4382-1.82746-.934-.49577-.4957-.82259-1.1352-.93397-1.8274-.11139-.69226-.00167-1.40197.31355-2.02824.31521-.62626.81988-1.13719 1.44221-1.46011.62233-.32291 1.33064-.44138 2.02417-.33853.7074.1049 1.3624.43455 1.8681.94025.5057.50571.8353 1.16065.9402 1.86808ZM14.5833 5.41699h.01"
                    stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M14.1667 1.66699H5.83342c-2.30119 0-4.16667 1.86548-4.16667 4.16667V14.167c0 2.3012 1.86548 4.1667 4.16667 4.1667h8.33328c2.3012 0 4.1667-1.8655 4.1667-4.1667V5.83366c0-2.30119-1.8655-4.16667-4.1667-4.16667Z"
                    stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M13.3333 9.47525c.1028.69355-.0157 1.40185-.3386 2.02415-.3229.6224-.8338 1.127-1.4601 1.4422-.6263.3153-1.336.425-2.02819.3136-.69222-.1114-1.33169-.4382-1.82746-.934-.49577-.4957-.82259-1.1352-.93398-1.8274-.11138-.69226-.00166-1.40197.31355-2.02824.31522-.62626.81989-1.13719 1.44222-1.46011.62233-.32291 1.33064-.44138 2.02416-.33853.7075.1049 1.3624.43455 1.8681.94025.5057.50571.8353 1.16065.9403 1.86808ZM14.5833 5.41699h.01"
                    stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </a>
        <a href="https://odlyworkshop.com/category/jiho-choi-x-odlyworkshop/83/" @click="this.stopPropagation($event)">
            <svg class="tshirt" version="1.1" id="레이어_2" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1080 1080"
                style="enable-background:new 0 0 1080 1080;" xml:space="preserve">
                <g>
                    <path stroke-width="25" :stroke="(this.color === 'white') ? '#fff' : '#000'"
                    :fill="(this.color === 'white') ? '#fff' : '#000'" d="M745.57,850.04H334.43c-8.28,0-15-6.72-15-15V527.21l-17.37,18.61c-2.81,3.01-6.73,4.73-10.84,4.76c-0.04,0-0.08,0-0.12,0
                    c-4.07,0-7.97-1.66-10.8-4.59L154.95,416c-5.71-5.92-5.59-15.35,0.29-21.11l157.71-154.9c6.59-6.47,15.29-10.03,24.52-10.03h105.29
                    c7.11,0,13.24,4.99,14.69,11.94c0.58,2.7,15.35,67.44,82.56,67.44c67.21,0,81.98-64.74,82.57-67.49
                    c1.45-6.96,7.57-11.89,14.67-11.89h105.29c9.23,0,17.94,3.56,24.52,10.03l157.71,154.9c5.87,5.77,6,15.19,0.29,21.11L799.7,546
                    c-2.86,2.96-6.77,4.6-10.92,4.59c-4.12-0.03-8.04-1.76-10.84-4.76l-17.37-18.61v307.83C760.57,843.32,753.85,850.04,745.57,850.04z
                    M349.43,820.04h381.14V489.16c0-6.16,3.77-11.7,9.5-13.96c5.73-2.26,12.26-0.78,16.47,3.72l32.54,34.87l104.06-107.92
                    L746.03,261.39c-0.94-0.92-2.19-1.43-3.5-1.43h-94.12c-3.08,8.71-8.48,21.08-17.32,33.43c-15.02,20.96-43.02,45.95-91.09,45.95
                    s-76.07-24.99-91.09-45.95c-8.85-12.34-14.24-24.72-17.32-33.43h-94.12c-1.32,0-2.56,0.51-3.5,1.43L186.86,405.88l104.06,107.92
                    l32.54-34.87c4.2-4.5,10.73-5.98,16.47-3.72c5.73,2.26,9.5,7.79,9.5,13.96V820.04z" />
                </g>
            </svg>
        </a>
    </div>
</template>
<script>
    export default {
        name: '',
        components: {},
        props: {
            artwork: Object
        },
        data() {
            return {
                color: this.artwork.getColor()
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
            stopPropagation (event) {
                if (event.stopPropagation) {
                    event.stopPropagation()
                } 
                else {
                    event.cancelBubble = true
                }
                this.$gtag.event('click', {
                    event_category: 'artwork',
                    event_label: 'sns',
                    value: this.artwork.getID()
                })
                return false
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/snsLink.scss"></style>