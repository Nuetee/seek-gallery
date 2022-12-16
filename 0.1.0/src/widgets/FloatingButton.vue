<template>
    <div class="FloatingButton poppins" ref="floatingButton" @click="this.clickFloatingButton()">
        <div class="phrase" v-if="this.is_clicked">
            Love it
        </div>
        <Eyes v-else></Eyes>
    </div>
</template>
<script>

import Eyes from './Eyes.vue';

export default {
    name: 'FloatingButton',
    components: {
        Eyes
    },
    data() {
        return {
            is_clicked: true,
        };
    },
    methods: {
        stopPropagation(event) {
            // event 전파 방지
            if (event.stopPropagation) event.stopPropagation();
            else event.cancelBubble = true; // IE 대응
        },
        clickFloatingButton () {
            this.$emit('click-floating-button', this.is_clicked)
            this.is_clicked = !this.is_clicked
        }
    }
}
</script>
<style lang="scss" scoped src="../scss/widgets/floatingButton.scss"></style>