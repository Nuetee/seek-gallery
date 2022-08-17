<template>
    <div class="titleHeader">
        {{ this.title }}
    </div>
    <div class="underLine"></div>
</template>
<script>
    export default {
        name: 'TitleHeader',
        components: {},
        props: {
            title: {
                type: String,
                default: 'Default'
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
<style lang="scss" scoped src="../scss/widgets/titleHeader.scss"></style>