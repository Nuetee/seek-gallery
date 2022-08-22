<template></template>
<script>
    import {
        check,
        refresh,
        save
    } from '@/modules/auth'
    import { 
        getKakaoToken,
        getUserData
    } from '@/modules/kakao'
    import { useCookies } from 'vue3-cookies'

    export default {
        name: '',
        components: {},
        setup() {
            const { cookies } = useCookies()
            return { cookies }
        },
        data() {
            return {
                provider: this.$route.query.provider,
                authCode: this.$route.query.code
            };
        },
        async created() {
            // Authentication result
            let result = false

            // Kakao callback response
            if (this.provider === 'kakao') {
                const token_data = await getKakaoToken(this.authCode)

                // Receive token successfully
                if (token_data) {
                    const access_token = token_data.access_token
                    const refresh_token = token_data.refresh_token
                    const expire_time = token_data.refresh_token_expires_in
                    const user_data = await getUserData(access_token)

                    // Receive user data successfully
                    if (user_data) {
                        const provider_id = user_data.id
                        const user_id = await check(this.provider, provider_id)

                        // Given user is already registered
                        if (user_id) {
                            await refresh(
                                this.provider, access_token,
                                refresh_token, expire_time
                            )
                            await save(
                                user_id, this.provider, access_token,
                                user_data.profile_image, user_data.thumbnail_image)
                            result = true
                        } 
                    }
                }
            }

            // If fail, go back to login page
            if (result) {
                this.$router.replace('/')
            }
            else {
                this.$router.replace('/login')
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