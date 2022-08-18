<template>
    <div class="titleHeader">
        {{ this.title }}
    </div>
    <div :id="this.title" class="underLine" :style="'width:' + this.progression + '%'"></div>
</template>
<script>
    export default {
        name: 'TitleHeader',
        components: {},
        props: {
            title: {
                type: String,
                default: 'Default'
            },
            startHeight: {
                type: Number,
                default: 0
            },
            heightUnit: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                under_line_element: null,
                initial_position: null,
                progression: 0
            };
        },
        beforeCreate() {},
        created() {
            window.addEventListener('scroll', this.setProgression)
        },
        beforeMount() {},
        mounted() {
            this.setInitialPosition()
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            setInitialPosition () {
                this.under_line_element = document.getElementById(this.title)
                this.initial_position = window.innerHeight - this.under_line_element.getBoundingClientRect().bottom
            },
            setProgression () {
                let current_position = window.innerHeight - this.under_line_element.getBoundingClientRect().bottom

                let progression = 0
                if (this.initial_position < this.startHeight) {
                    progression = ((current_position - this.startHeight)) / this.heightUnit
                }
                else {
                    progression = (current_position - this.initial_position) / this.heightUnit
                }

                (progression < 1) ? (this.progression = 0) : ((progression >= 100) ? (this.progression = 100) : (this.progression = progression))
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/titleHeader.scss"></style>