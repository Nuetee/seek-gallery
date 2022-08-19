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
            contents_height: Number,
            // 스크롤해서 일정 위치에 올랐을 때, fade-in과 살짝 위로올라오는 애니메이션을 주기 위해선 top_position을 부모요소 또는 dotscrollbar가 해당 위치에 도달한 경우에 설정되도록 해야 한다. 또는 transform: translate이 위치에 영향을 미치는지 확인(절대/상대 모두)
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
            window.addEventListener('scroll', this.setProgressBar)
            this.dotScrollBar = document.getElementsByClassName('dotScrollBar')[0]

            // 이식 시 변경해야 되는 부분 --
            this.header = document.getElementsByClassName('mainHeader')[0]
            // -- 이식 시 변경해야 되는 부분

            let scroll_bar_height = (window.innerHeight - this.header.getBoundingClientRect().height) * 0.8
            let scroll_bar_top = this.header.getBoundingClientRect().height + 10

            this.scroll_bar_style = 'height: ' + scroll_bar_height + 'px; top:' + scroll_bar_top + 'px;'
        },
        methods: {
            setProgressBar () {
                if (!this.position_array || !this.contents_height || !this.contents_top_position) {
                    return
                }
                
                let scroll_distance = window.scrollY + this.header.getBoundingClientRect().height - this.contents_top_position

                if (scroll_distance <= 0) {
                    this.progression = 0
                }
                else {
                    let progression = scroll_distance / this.contents_height
                    progression > 1 ? this.progression = 1 : this.progression = progression
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
                let scroll_position = this.contents_height * percentile + this.contents_top_position - this.header.getBoundingClientRect().height

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