<template>
    <div class="mainHeader" :style="'background-color:' + this.background_color">
        <div class="left">
            <slot></slot>
        </div>
        <div class="right">
            <RoundProfile :profile="this.profile"></RoundProfile>
        </div>
    </div>
</template>
<script>
    import RoundProfile from './RoundProfile.vue';
    import { isAuth, getAuth } from '@/modules/auth';

    export default {
        name: 'MainHeader',
        components: { RoundProfile },
        props: {
            background_color: {
                type: String,
                default: 'transparent'
            }
        },
        data() {
            return {
                profile: ''
            };
        },
        beforeCreate() {},
        created() {
            if (isAuth()) {
                let user = getAuth()
                this.profile = user.getProfile()
            }
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/widgets/mainHeader.scss"></style>