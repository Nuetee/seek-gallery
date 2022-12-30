<template>
    <div class="drawer" :class="this.class_name" @scroll="this.stopPropagation($event)" @click="this.stopPropagation($event)">
        <div class="header">
            <div class="drawingBar">
                <div></div>
            </div>
        </div>
        <div class="closeButton" @click="this.closeDrawer()">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976312 12.6834 -0.0976312 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976312 12.6834 -0.0976312 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z"
                    fill="black" />
            </svg>
        </div>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'Drawer',
        components: {},
        props: {
            class_name: String
        },
        data() {
            return {
                drawer: null,
                drawing_bar: null,
                drawer_height: 0,
                touch_start: 0,
                last_touch_move: 0,
                touch_end: 0,
                drawer_opened: false
            };
        },
        mounted() {
            let drawer_class = 'drawer' + ' ' + this.class_name

            this.drawer = document.getElementsByClassName(drawer_class)[0]

            this.drawer.addEventListener('touchmove', (evt) => {
                if (evt.stopPropagation) evt.stopPropagation();
                else evt.cancelBubble = true; // IE 대응
            })
            
            this.drawer_height = this.drawer.clientHeight
            
            this.drawing_bar = this.drawer.firstChild.firstChild
            
            this.drawing_bar.addEventListener('touchstart', this.setTouchStart)
            this.drawing_bar.addEventListener('touchmove', this.setTouchMove)
            this.drawing_bar.addEventListener('touchend', this.setTouchEnd)
        },
        methods: {
            stopPropagation (event) {
                // event 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응
            },
            showDrawer () {
                const _this = this
                if (this.drawer === null) {
                    let drawer_class = 'drawer' + ' ' + this.class_name
                    this.drawer = document.getElementsByClassName(drawer_class)[0]
                }
                this.drawer_height = this.drawer.clientHeight

                if (this.drawing_bar === null) {
                    this.drawing_bar = this.drawer.firstChild.firstChild
                    this.drawing_bar.addEventListener('touchstart', this.setTouchStart)
                    this.drawing_bar.addEventListener('touchmove', this.setTouchMove)
                    this.drawing_bar.addEventListener('touchend', this.setTouchEnd)
                }

                this.drawer.style.setProperty('bottom', `${this.drawer_height - 10}px`)

                setTimeout(() => {
                    _this.drawer_opened = true
                }, 500)
            },
            closeDrawer() {
                if (this.drawer_opened === false) {
                    return
                }
                this.drawer.style.setProperty('bottom', '0')
                this.drawer_opened = false
            },
            setTouchStart(event) {
                this.stopPropagation(event)
                this.touch_start = event.changedTouches[0].clientY
                this.last_touch_move = this.touch_start
                this.drawer.style.setProperty('transition', 'none')
            },
            setTouchMove (event) {
                this.stopPropagation(event)
                let touch_move = event.changedTouches[0].clientY;
                
                let distance = touch_move - this.last_touch_move
                if (distance) {
                    //let drawer_initial_bottom = this.drawer_height - 10
                    let drawer_initial_bottom = parseFloat(this.drawer.style.getPropertyValue('bottom').replace('px', ''))
                    if (drawer_initial_bottom - distance > this.drawer.clientHeight) {
                        return
                    }

                    this.drawer.style.setProperty('bottom', `${drawer_initial_bottom - distance}px`)
                    this.last_touch_move = touch_move
                }
            },
            setTouchEnd (event) {
                this.stopPropagation(event)
                this.drawer.style.setProperty('transition', 'bottom 0.5s')
                let touch_end = event.changedTouches[0].clientY

                let distance = touch_end - this.touch_start
                const standard_distance = window.innerWidth * 0.2

                if (distance > standard_distance) {
                    this.drawer.style.setProperty('bottom', '0')
                    this.drawer_opened = false
                }
                else {
                    this.drawer.style.setProperty('bottom', `${this.drawer_height - 10}px`)
                    this.drawer_opened = true
                }
            }
        }
    }
</script>
<style lang="scss" scoped src="../scss/widgets/drawer.scss"></style>