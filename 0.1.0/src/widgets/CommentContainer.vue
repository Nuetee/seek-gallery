<template>
    <div class="commentContainer">
        <div class="commentBody">
            <div class="writer">
                <div class="name">
                    {{ this.comment.getWriter().getNickname() }}
                </div>
                <div v-if="this.deleteEnabled" @click="this.delete">
                    <svg width="10" height="19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.97322.358407 10 .331629 9.66837 0 5 4.66837.331629 0 0 .331629 4.66837 5 .026778 9.64159 0 9.66837.331629 10 5 5.33163 9.66837 10 10 9.66837 5.33163 5 9.97322.358407Z" fill="#000"/>
                    </svg>
                </div>
                <div v-else>
                    <a class="reportButton" :href="this.reportURL">
                        {{'신고'}}
                    </a>
                </div>
            </div>
            <div class="body">{{ this.comment.getBody() }}</div>
        </div>
        <div v-if="this.comment" class="likeContainer">
            <div class="likeButton">
                <svg @click="this.like($event)" :fill="(this.isLiked) ? 'black' : 'none'" stroke="black" width="17" height="14" stroke-width="0.7" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4.71566C15 7.25307 11.3413 10.762 9.06664 12.5644C8.73087 12.8304 8.26303 12.8387 7.91955 12.5827C5.64397 10.8866 2 7.50117 2 4.71566C2 -0.116843 8.5 -0.116838 8.5 4.02531C8.5 -0.116844 15 -0.116858 15 4.71566Z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="likeCount poppins">
                {{ this.comment.getLikeCount() }}
            </div>
        </div>
    </div>
</template>
<script>
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'

    export default {
        name: 'CommentContainer',
        components: {},
        props: {
            comment: Object
        },
        data() {
            return {
                likeInProgress: false,
                deleteInProgress: false,
                deleteEnabled: false,
                isLiked: false,
                reportURL: 'http://pf.kakao.com/_kxoXgb/chat'
            };
        },
        async created() {
            if (isAuth()) {
                const user = getAuth()
                if (user.getID() === this.comment.getWriter().getID()) {
                    this.deleteEnabled = true
                }
                this.isLiked = await user.isCommentLiked(this.comment)
            }
        },
        methods: {
            async like (event) {
                if (this.likeInProgress) {
                    return false
                }

                let target = event.target
                while (target.tagName !== 'svg') {
                    target = target.parentElement
                }
                
                // Authorized user exist
                if (this.checkAuth()) {
                    this.likeInProgress = true
                    const user = getAuth()
                    this.isLiked = await user.isCommentLiked(this.comment)
                    if (this.isLiked) {
                        await user.putCommentUnlike(this.comment)
                        //console.log(event.target.classList.contains('liked'))
                        target.classList.remove('liked')
                    } 
                    else {
                        await user.putCommentLike(this.comment)
                        //console.log(event.target.classList.contains('liked'))
                        target.classList.add('liked')
                    }
                    this.isLiked = !this.isLiked
                    this.likeInProgress = false
                }
            },
            async delete () {
                if (this.deleteInProgress) {
                    return false
                }

                // Authorized user exist
                if (this.checkAuth()) {
                    this.deleteInProgress = true
                    const user = getAuth()
                    if (this.comment.getWriter().getID() === user.getID()) {
                        const result = await user.deleteComment(this.comment)
                        if (result) {
                            // Update comment list
                            this.$emit('deleteComment', this.comment.getID())
                        }
                    }
                    this.deleteInProgress = false
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
<style lang="scss" scoped src="../scss/widgets/commentContainer.scss"></style>