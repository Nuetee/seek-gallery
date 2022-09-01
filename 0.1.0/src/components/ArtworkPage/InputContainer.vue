<template>
    <div class="inputContainer">
        <div class="poppins">Comment</div>
        <form action="javascript:void(0);">
            <textarea 
                v-model="this.body" 
                @click="this.input"
                rows="3" 
                placeholder="아트워크에 대한 감상평을 남겨주세요."></textarea>
            <div>
                <input 
                    @click="this.submit" 
                    type="submit" value="확인">
            </div>
        </form>
    </div>
</template>
<script>
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'

    export default {
        name: 'InputContainer',
        components: {},
        props: {
            artwork: {
                type: Object
            }
        },
        data() {
            return {
                body: '',
                submitInProgress: false
            };
        },
        methods: {
            input () {
                this.checkAuth()
            },
            async submit () {
                if (this.checkAuth() && !this.submitInProgress && this.body.trim() !== "") {
                    this.submitInProgress = true
                    const user = getAuth()
                    const result = await user.putComment(this.artwork, this.body.trim())
                    if (result) {
                        // Update comment list
                        this.body = ''
                        this.$emit('insertComment', result)
                    }
                    this.submitInProgress = false
                }
            },
            checkAuth () {
                // No authorization information
                if (!isAuth()) {
                    this.$router.replace({
                        path: '/login',
                        query: {
                            redirect: this.$route.fullPath
                        }
                    })
                    return false
                }
                return true
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/inputContainer.scss"></style>