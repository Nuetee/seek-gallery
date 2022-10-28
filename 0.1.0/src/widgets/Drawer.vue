<template>
    <div class="drawer" :class="this.class_name" @scroll="this.stopPropagation($event)" @click="this.stopPropagation($event)">
        <div class="header">
            <div class="drawingBar">
                <div></div>
            </div>
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