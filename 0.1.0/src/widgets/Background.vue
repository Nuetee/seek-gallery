<template>
    <div id="background" :style="this.background_display ? 'display:none' : ''"></div>
</template>
<script>
    export default {
        name: 'Background',
        components: {},
        props: {
            background_display: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                sampleData: ''
            };
        },
    }
</script>
<style lang="scss" scoped src="../scss/widgets/background.scss"></style>