<template>
    <div class="commentList">
        <TransitionGroup name="slide-fade">
            <CommentContainer 
                v-for="comment in this.commentList" 
                :key="comment" 
                :comment="comment"
                @deleteComment="this.delete"></CommentContainer>
        </TransitionGroup>
    </div>
</template>
<script>
    import CommentContainer from '@/widgets/CommentContainer.vue';

    export default {
        name: 'CommentList',
        components: {
            CommentContainer
        },
        props: {
            artwork: Object,
            commentList: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                sampleData: ''
            };
        },
        methods: {
            delete (comment_id) {
                this.$emit('deleteComment', comment_id)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .commentList {
        color: black;
    }
</style>