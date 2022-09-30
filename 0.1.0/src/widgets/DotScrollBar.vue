<template>
    <div class="dotScrollBar" v-show="this.position_array && this.contents_height && this.contents_top_position"
        :style="this.scroll_bar_style">
        <div class="categoryButton" v-for="(setting, i) in this.buttonSettings" :key="i"
            :style="'top: ' + setting.position + '%;'">
            <div class="categoryCircle" 
                :style="'background-color:' + setting.background_color"
                @click="this.showCategoryName(i)"
            ></div>
            <div class="categoryName"
                :style="'background-color:' + setting.background_color + '; color: ' + setting.color"
                @click="this.scrollToCategory(setting.position, i)"
            >
                {{ setting.category }}
            </div>
        </div>
        <div class="progressBarContainer">
            <div class="progressBar"></div>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'DotScrollBar',
        components: {},
        props: {
            document_element_id: {
                type: String,
                default: null
            },
            position_array: {
                type: Array,
                default: []
            },
            contents_height: Number,
            contents_top_position: Number,
        },
        data() {
            return {
                dotScrollBar: null,
                scroll_bar_style: '',
                header: null,
                progression: 0,
            };
        },
        computed: {
            buttonSettings () {
                let button_setting_array = new Array(0)

                for (let i = 0; i < this.position_array.length; i++) {
                    if (this.position_array[i] !== null) {
                        let button_setting = new Object()
                        button_setting.position = (i / this.position_array.length) * 100
                        button_setting.category = this.position_array[i]
                        button_setting.background_color = '#AEAEAE'
                        button_setting.color = 'black'

                        if ((i / this.position_array.length) < this.progression + 0.01 && this.progression !== 0) {
                            button_setting.background_color = 'black'
                            button_setting.color = 'white'
                        }

                        button_setting_array.push(button_setting)
                    }
                }

                return button_setting_array
            },
        },
        mounted () {
            // 이식 시 변경해야 되는 부분 --
            this.header_height = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", "")) * 17.5 * 0.7
            // -- 이식 시 변경해야 되는 부분
            
            if (this.document_element_id)
                document.getElementById(this.document_element_id).addEventListener('scroll', this.setProgressBar)
            else
                window.addEventListener('scroll', this.setProgressBar)

            this.dotScrollBar = document.getElementsByClassName('dotScrollBar')[0]

            let scroll_bar_height = (window.innerHeight - this.header_height) * 0.8

            this.scroll_bar_style = 'height: ' + scroll_bar_height + 'px; top:' + this.header_height + 'px;'
        },
        unmounted () {
            if (this.document_element_id === null)
                window.removeEventListener('scroll', this.setProgressBar)
        },
        methods: {
            setProgressBar () {
                if (!this.position_array || !this.contents_height || !this.contents_top_position) {
                    return
                }
                
                let view_content_height = window.innerHeight - this.header_height

                let scroll_distance = this.header_height - this.contents_top_position
                
                if (this.document_element_id) {
                    scroll_distance += document.getElementById(this.document_element_id).scrollTop
                }
                else
                    scroll_distance += window.scrollY

                if (scroll_distance <= 0) {
                    this.progression = 0
                }
                else {
                    let progression = scroll_distance / (this.contents_height - view_content_height)

                    progression > 1 || progression < 0 ? this.progression = 1 : this.progression = progression
                }

                let progress_bar_element = document.getElementsByClassName('progressBar')[0]
                if (progress_bar_element) {
                    progress_bar_element.style.setProperty('transform', `scaleY(${this.progression})`)
                }
                else {
                    console.log("Can't get progress bar DOM element.")
                }
            },
            showCategoryName (button_index) {
                for (let i = 0; i < this.buttonSettings.length; i++) {
                    if (i === button_index) {
                        document.getElementsByClassName('categoryCircle')[i].style.setProperty('opacity', '0')
                        document.getElementsByClassName('categoryCircle')[i].style.setProperty('z-index', '0')

                        document.getElementsByClassName('categoryName')[i].style.setProperty('opacity', '1')
                        document.getElementsByClassName('categoryName')[i].style.setProperty('z-index', '1')
                    }
                    else {
                        document.getElementsByClassName('categoryCircle')[i].style.setProperty('opacity', '1')
                        document.getElementsByClassName('categoryCircle')[i].style.setProperty('z-index', '1')

                        document.getElementsByClassName('categoryName')[i].style.setProperty('opacity', '0')
                        document.getElementsByClassName('categoryName')[i].style.setProperty('z-index', '0')
                    }
                }
            },
            scrollToCategory (category_position, button_index) {
                let percentile = category_position / 100
                let scroll_position = this.contents_height * percentile + this.contents_top_position - this.header_height

                if (this.document_element_id)
                    document.getElementById(this.document_element_id).scrollTo({ top: scroll_position, behavior: "smooth" })
                else
                    window.scrollTo({ top: scroll_position, behavior: "smooth" })
                
                document.getElementsByClassName('categoryCircle')[button_index].style.setProperty('opacity', '1')
                document.getElementsByClassName('categoryCircle')[button_index].style.setProperty('z-index', '1')

                document.getElementsByClassName('categoryName')[button_index].style.setProperty('opacity', '0')
                document.getElementsByClassName('categoryName')[button_index].style.setProperty('z-index', '0')
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/dotScrollBar.scss"></style>