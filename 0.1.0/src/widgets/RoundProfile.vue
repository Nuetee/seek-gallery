<template>
    <div class="roundProfile">
        <svg v-if="!this.profile" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="14.15" :stroke="this.color" stroke-width="1.7"/>
        <path d="M21.6668 21.5V19.8333C21.6668 18.9493 21.3156 18.1014 20.6905 17.4763C20.0654 16.8512 19.2176 16.5 18.3335 16.5H11.6668C10.7828 16.5 9.93493 16.8512 9.30981 17.4763C8.68469 18.1014 8.3335 18.9493 8.3335 19.8333V21.5" :stroke="this.color" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.9998 13.1667C16.8408 13.1667 18.3332 11.6743 18.3332 9.83333C18.3332 7.99238 16.8408 6.5 14.9998 6.5C13.1589 6.5 11.6665 7.99238 11.6665 9.83333C11.6665 11.6743 13.1589 13.1667 14.9998 13.1667Z" :stroke="this.color" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <img v-else :src="this.profile" :style="this.profileStyle">
    </div>
</template>
<script>
    import { cropImage } from '@/modules/image.js'
    export default {
        name: 'RoundProfile',
        components: {},
        props: {
            profile: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: 'black'
            }
        },
        data() {
            return {
                profileStyle: ''
            };
        },
        async created() {
            this.profileStyle = await cropImage(this.profile, 1)
        },
    }
</script>
<style lang="scss" scoped src="../scss/widgets/roundProfile.scss">
</style>