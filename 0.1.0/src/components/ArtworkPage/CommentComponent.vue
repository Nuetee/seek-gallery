<template>
    <div class="commentComponent comment">
        <InputContainer 
            :artwork="this.artwork"
            @insertComment="this.insert"></InputContainer>
        <CommentList 
            v-if="this.commentList.length > 0" 
            :artwork="this.artwork" 
            :commentList="this.commentList"
            @deleteComment="this.delete"></CommentList>
    </div>
</template>
<script>
    import InputContainer from './InputContainer.vue'
    import CommentList from './CommentList.vue'
    import { Comment } from '@/classes/comment.js'
    import { isAuth, getAuth } from '@/modules/auth'

    export default {
        name: 'commentComponent',
        components: {
            InputContainer,
            CommentList
        },
        props: {
            artwork: Object
        },
        data() {
            return {
                user: null,
                commentIdList: [],
                myCommentList: [],
                otherCommentList: [],
                commentList: [],
                nothingToUpdate: false
            }
        },
        async created() {
            if (isAuth()) {
                this.user = getAuth()
            }
            await this.rebuild(0, 20)
        },
        methods: {
            async rebuild (offset, length) {
                this.commentIdList = await this.artwork.getCommentList(offset, length)
                if (this.commentIdList.length < 20) {
                    this.nothingToUpdate = true
                }
                for (let commentId of this.commentIdList) {
                    let comment = await new Comment(commentId.toString()).init()
                    if (this.user) {
                        if (this.user.getID() === comment.getWriter().getID()) {
                            this.myCommentList.push(comment)
                            continue
                        }
                    }
                    this.otherCommentList.push(comment)
                }
                this.commentList = this.myCommentList.concat(this.otherCommentList)
            },
            async insert (comment_id) {
                const comment = await new Comment(comment_id.toString()).init()
                this.myCommentList.unshift(comment)
                this.commentList.unshift(comment)
            },
            delete (comment_id) {
                for (let i = 0 ; i < this.commentList.length ; i++) {
                    if (this.commentList[i].getID() === comment_id) {
                        this.commentList.splice(i, 1)
                        i--
                    }
                }
                for (let j = 0 ; j < this.myCommentList.length ; j++) {
                    if (this.myCommentList[j].getID() === comment_id) {
                        this.myCommentList.splice(j, 1)
                        j--
                    }
                }
            },
            async load () {
                if (!this.nothingToUpdate) {
                    await this.rebuild(this.commentList.length, 20)
                    this.$emit('commentUpdate')
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/commentComponent.scss"></style>