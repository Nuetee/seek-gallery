<template>
    <div
        ref="dotScrollBar"
        class="dotScrollBar" 
        :style="'height: ' + this.scrollBarHeight + 'px;'"
    >
        <div
            class="categoryButton"
            v-for="(category, i) in this.category_list"
            :style="'top:' + this.getCategoryButtonPosition(i) + '%'"
            v-show="category !== ''"
        >
            <div class="categoryCircle"
                :style="this.categoryBackgroundColor(i)"
                @click="this.showCategoryName(i)"></div>
            <div class="categoryName"
                :style="this.categoryBackgroundColor(i)"
                @click="this.scrollToCategory(i)"
            >
                {{ category }}
            </div>
        </div>
        <div class="progressBarContainer">
            <div class="progressBar" :style="'transform:scaleY(' + this.progression + ');'"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'DotScrollBar',
        components: {},
        props: {
            // scroll의 basis가 되는 element id (스크롤 되지 않음)
            basis_element_id: {
                type: String,
                default: 'app'
            },
            scroll_basis_element_id: {
                type: String,
                default: ''
            },
            // 스크롤바가 표시하는 element
            scroll_element_class :String,
            category_list: Array,
            artwork_track_list: Array,
            contents_height: Number
        },
        data() {
            return {
                standard_height: null,
                progression: -1,
            };
        },
        computed: {
            scrollBarHeight () {
                if (this.contents_height < this.standard_height) {
                    return this.contents_height
                }
                else {
                    return this.standard_height
                }
            },
        },
        beforeCreate() {},
        created() {
            let header_height = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", "")) * 17.5 * 0.7
            this.standard_height = (window.innerHeight - header_height) * 0.8
        },
        beforeMount() {},
        mounted() {
            if (this.basis_element_id)
                document.getElementById(this.basis_element_id).addEventListener('scroll', this.setProgressBar)
            else
                window.addEventListener('scroll', this.setProgressBar)
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            getCategoryButtonPosition (index) {
                let button_position_array = new Array (this.category_list.length)

                let total_artwork = 0
                this.artwork_track_list.forEach((value, index_2) => {
                    button_position_array[index_2] = total_artwork
                    total_artwork += value.length
                })

                return (button_position_array[index]/total_artwork) * 100
            },
            setProgressBar () {
                let header_height = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", "")) * 17.5 * 0.7
                let contents_top = document.getElementsByClassName(this.scroll_element_class)[0].getBoundingClientRect().top
                
                let progression = 0
                if (contents_top - header_height > 0) {
                    progression = -1
                }
                else if (this.contents_height + (contents_top - header_height) < 0) {
                    progression = 1
                }
                else {
                    progression = (header_height - contents_top) / this.contents_height
                }

                this.progression = progression
            },
            categoryBackgroundColor (index) {
                if (this.progression === -1) {
                    return 'background-color:#AEAEAE;color:black;'
                }
                if (this.getCategoryButtonPosition(index)/100 > this.progression) {
                    return 'background-color:#AEAEAE;color:black;'
                }
                else {
                    return 'background-color:black;color:white'
                }
            },
            showCategoryName(button_index) {
                for (let i = 0; i < this.category_list.length; i++) {
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
            scrollToCategory(index) {
                //let header_height = parseFloat(document.documentElement.style.getPropertyValue('--vw').replace("px", "")) * 17.5 * 0.7
                let scroll_position = document.getElementsByClassName('category')[index].getBoundingClientRect().top - document.getElementById(this.scroll_basis_element_id).getBoundingClientRect().top

                if (this.basis_element_id)
                    document.getElementById(this.basis_element_id).scrollTo({ top: scroll_position, behavior: "smooth" })
                else
                    window.scrollTo({ top: scroll_position, behavior: "smooth" })
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/dotScrollBar.scss"></style>