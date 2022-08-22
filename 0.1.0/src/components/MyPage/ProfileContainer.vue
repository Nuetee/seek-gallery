<template>
    <div class="profileContainer" v-if="this.loadFlag">
        <RoundProfile :profile="this.profile"></RoundProfile>
        <div class="nickName">{{ this.user.getNickname() }}</div>
        <SettingButton></SettingButton>
    </div>
</template>
<script>
    import RoundProfile from '@/widgets/RoundProfile.vue';
    import SettingButton from './SettingButton.vue';
    import { isAuth, getAuth } from '@/modules/auth';

    export default {
        name: 'ProfileContainer',
        components: {
            RoundProfile,
            SettingButton
        },
        data() {
            return {
                user: null,
                profile: '',
                loadFlag: false
            };
        },
        beforeCreate() {},
        async created() {
            if (isAuth()) {
                this.user = getAuth()
                this.profile = this.user.getProfile()
                this.loadFlag = true
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
<style lang="scss" scoped src="../../scss/MyPage/profileContainer.scss"></style>