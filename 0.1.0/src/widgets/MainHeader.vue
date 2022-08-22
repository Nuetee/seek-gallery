<template>
    <div class="mainHeader" :style="'background-color:' + this.background_color">
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'MainHeader',
        components: {},
        props: {
            background_color: {
                type: String,
                default: 'transparent'
            }
        },
        data() {
            return {
                sample: ''
            };
        },
    }
</script>
<style lang="scss" scoped src="../scss/widgets/mainHeader.scss"></style>