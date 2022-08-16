<template>
    <div class="mainHeader" :style="'background-color:' + this.background_color">
        <div class="left">
            <slot></slot>
        </div>
        <div class="right">
            <RoundProfile></RoundProfile>
        </div>
    </div>
</template>
<script>
import RoundProfile from './RoundProfile.vue';
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
        methods: {}
    }
</script>
<style lang="scss" scoped src="../scss/widgets/mainHeader.scss"></style>