<template>
    <div class="dotScrollBar" v-if="this.position_array && this.height && this.position">
        <div class="categoryButton" v-for="(setting, i) in this.buttonSettings" :key="i"
            :style="'top: ' + setting.position + '%'">
            <div v-if="setting.category_show">{{ setting.category }}</div>
        </div>
        <div class="progressBar"></div>
    </div>
</template>
<script>
    export default {
        name: 'DotScrollBar',
        components: {},
        props: {
            position_array: {
                type: Array,
                default: []
            },
            height: Number,
            position: Number
        },
        data() {
            return {
                sampleData: ''
            };
        },
        computed: {
            buttonSettings () {
                let button_setting_array = new Array(0)

                for (let i = 0; i < this.position_array.length; i++) {
                    if (this.position_array[i] !== null) {
                        let button_setting = new Object()
                        button_setting.position = i * 10
                        button_setting.category = this.position_array[i]
                        button_setting.category_show = false

                        button_setting_array.push(button_setting)
                    }
                }

                return button_setting_array
            }
        },
        beforeCreate() {},
        created() {
            window.addEventListener('click', this.setProgressBar())
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            setProgressBar () {
                console.log('asd')
                if (window.scrollY < this.position) {
                    return
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/dotScrollBar.scss"></style>