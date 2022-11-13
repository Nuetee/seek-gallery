<template>
    <div class="list" :class="is_artwork?'artwork_list':'exhibition_list'">
    </div>
    <div v-if="!this.id_list || !this.id_list.length">{{ ((this.is_artwork) ? '작업' : '전시') + ' 없음' }}</div>
</template>
<script>
import { Artwork } from '@/classes/artwork';
import { Exhibition } from '@/classes/exhibition';

export default {
    name: 'List',
    components: {},
    props: {
        single_column: {
            type: Boolean,
            default: true
        },
        id_list: {
            type: Array,
            default: null
        },
        is_artwork: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            abortController: null,
            first_column_height: 0,
            second_column_height: 0
        };
    },
    watch: {
        'single_column': {
            handler() {
                this.abortController.abort()
                this.switchChildrenSorting(this.id_list)
            }
        },
        'id_list': {
            handler () {
                const _this = this
                this.abortController.abort()
                this.abortController = null
                this.abortController = new AbortController()
                this.loadChildren(this.abortController.signal)
                .catch(function (err) { 
                    console.log('Load is cutting off.')
                    _this.switchChildrenSorting(_this.id_list)
                })
            }
        }
    },
    beforeCreate() {},
    created() {
        this.abortController = new AbortController()
    },
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {},
    methods: {
        loadChildren (abortSignal) {
            return new Promise(async (resolve, reject) => {
                abortSignal.addEventListener('abort', () => {
                    const error = new DOMException('Calculation aborted by the user', 'AbortError');
                    return reject(error);
                })
                
                let list_element = null
                if (this.is_artwork) {
                    list_element = document.getElementsByClassName("list artwork_list")[0]
                }
                else {
                    list_element = document.getElementsByClassName("list exhibition_list")[0]
                }
                
                if (!list_element) {
                    resolve(true)
                }
                else {
                    let loaded_elements_number = list_element.children.length
                    let id_list = this.id_list.slice(loaded_elements_number)

                    if (this.single_column) {
                        list_element.classList.remove('doubleColumn')
                        list_element.classList.add('singleColumn')
                    }
                    else {
                        list_element.classList.add('doubleColumn')
                        list_element.classList.remove('singleColumn')
                    }

                    for (let index in id_list) {
                        let child = document.createElement("div")
                        let thumbnail = document.createElement("img")
                        let name = document.createElement("div")
                        let owner_icon = this.is_artwork ? null : document.createElementNS("http://www.w3.org/2000/svg", "svg")
                        if (owner_icon) {
                            owner_icon.setAttribute("width", "26")
                            owner_icon.setAttribute("height", "26")
                            owner_icon.setAttribute("viewBox", "0 0 26 26")
                            owner_icon.setAttribute("fill", "none")
                            owner_icon.classList.add('ownerIcon')
                        }
                        
                        child.classList.add('child')
                        thumbnail.classList.add('thumbnail')
                        name.classList.add('name')

                        let id = id_list[index]
                        let thumbnail_src = null
                        let name_text = null
                        let Object = null

                        if (this.is_artwork) {
                            Object = await new Artwork(id).init()
                        }
                        else {
                            Object = await new Exhibition(id.page_id).init()
                            if (id.is_owner === 1) {
                                owner_icon.innerHTML = '<circle cx="13" cy="13" r="13" fill="white" fill-opacity="0.8" /><path d = "M18.7778 18.7778V17.3333C18.7778 16.5672 18.4734 15.8324 17.9316 15.2906C17.3899 14.7488 16.6551 14.4444 15.8889 14.4444H10.1111C9.34492 14.4444 8.61012 14.7488 8.06835 15.2906C7.52658 15.8324 7.22221 16.5672 7.22221 17.3333V18.7778" stroke = "black" stroke - width="1.5" stroke - linecap="round" stroke - linejoin="round" /><path d="M13 11.5556C14.5955 11.5556 15.8889 10.2622 15.8889 8.66667C15.8889 7.07118 14.5955 5.77778 13 5.77778C11.4045 5.77778 10.1111 7.07118 10.1111 8.66667C10.1111 10.2622 11.4045 11.5556 13 11.5556Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />'
                            }
                            else {
                                owner_icon.innerHTML = '<circle cx="13" cy="13" r="13" fill="white" fill-opacity="0.8" /><path d = "M16.3102 18.2361V16.912C16.3102 16.2097 16.0312 15.5361 15.5346 15.0395C15.0379 14.5429 14.3644 14.2639 13.662 14.2639H8.36574C7.66341 14.2639 6.98984 14.5429 6.49322 15.0395C5.99659 15.5361 5.71759 16.2097 5.71759 16.912V18.2361" stroke = "black" stroke - width="1.5" stroke - linecap="round" stroke - linejoin="round" /> <path d="M11.0139 11.6157C12.4764 11.6157 13.662 10.4301 13.662 8.96759C13.662 7.50506 12.4764 6.31945 11.0139 6.31945C9.55136 6.31945 8.36574 7.50506 8.36574 8.96759C8.36574 10.4301 9.55136 11.6157 11.0139 11.6157Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M20.2824 18.2361V16.912C20.282 16.3253 20.0867 15.7553 19.7272 15.2916C19.3677 14.8279 18.8644 14.4966 18.2963 14.35" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /> <path d="M15.6482 6.40551C16.2178 6.55136 16.7227 6.88264 17.0832 7.34713C17.4438 7.81162 17.6395 8.3829 17.6395 8.9709C17.6395 9.5589 17.4438 10.1302 17.0832 10.5947C16.7227 11.0592 16.2178 11.3904 15.6482 11.5363" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />'
                            }
                        }

                        thumbnail_src = await Object.getThumbnailImage()
                        name_text = Object.getName()
                        thumbnail.setAttribute("src", thumbnail_src)

                        name.append(name_text)
                        child.appendChild(thumbnail)
                        child.appendChild(name)
                        if (owner_icon) {
                            child.appendChild(owner_icon)
                        }

                        list_element.appendChild(child)

                        await this.imageLoaded(thumbnail.src)

                        this.setChildStyle(child)
                    }
                    resolve(true)
                }
            })
            
        },
        switchChildrenSorting () {
            this.first_column_height = 0
            this.second_column_height = 0
            let list_element = null
            if (this.is_artwork) {
                list_element = document.getElementsByClassName("list artwork_list")[0]
            }
            else {
                list_element = document.getElementsByClassName("list exhibition_list")[0]
            }
            
            for (let child of list_element.children) {
                child.style.setProperty('transition', 'transform 0.3s ease, width 0.3s ease')
            }

            if (this.single_column) {
                list_element.classList.remove('doubleColumn')
                list_element.classList.add('singleColumn')
            }
            else {
                list_element.classList.add('doubleColumn')
                list_element.classList.remove('singleColumn')
            }

            for (let child of list_element.children) {
                this.setChildStyle(child, true)
            }
        },
        /**
         * List child element들의 style 속성을 설정하는 함수.
         * : child의 순서에 따라 transform: translate 속성을 설정한다.
         * : transition이 적용된 경우, width/height 값이 변화하기 전의 값으로 반영되므로  single_column/double_column의 상황에 맞게 translate의 y값에 child.offsetHeight의 2배 또는 1/2배를 더하여 올바른 위치를 설정한다.
         * @param {Object} child // child DOM Element 
         * @param {Boolean} width_transition // child DOM Element에 width_transition이 적용되지 않았으면 false
         */
        setChildStyle(child, width_transition = false) {
            
            if (this.single_column) {
                let name = child.children[1]

                child.style.transform = `translate(0px, ${this.first_column_height}px)`

                if (width_transition) {
                    this.first_column_height += (name.offsetHeight + ((2 * child.offsetWidth) * (child.offsetHeight - name.offsetHeight)) / (child.offsetWidth - (window.innerWidth * 0.015)))
                }
                else {
                    this.first_column_height += child.offsetHeight
                }

                // padding 속성을 first_column_height 계산 전에 먼저 설정하면 child의 height가 달라지므로 계산 값이 달라질 수 있다. 따라서 마지막에 설정한다.
                child.style.setProperty("padding-right", "0")
                child.style.setProperty("padding-left", "0")
            }
            else {
                if (this.first_column_height <= this.second_column_height) {
                    child.style.transform = `translate(0px, ${this.first_column_height}px)`
                    let name = child.children[1]
                    if (!this.is_artwork) {
                        let owner_icon = child.children[2]
                        owner_icon.style.setProperty('right', 'calc(var(--vw, 1vw) * 3)')
                    }
                    if (width_transition) {
                        this.first_column_height += name.offsetHeight + ((child.offsetHeight - name.offsetHeight) * ((child.offsetWidth / 2) - (window.innerWidth * 0.015))) / child.offsetWidth
                    }
                    else {
                        this.first_column_height += child.offsetHeight
                    }
                    child.style.setProperty("padding-right", "calc(var(--vw, 1vw) * 1.5)")
                }
                else {
                    child.style.transform = `translate(100%, ${this.second_column_height}px)`
                    let name = child.children[1]

                    if (width_transition) {
                        this.second_column_height += name.offsetHeight + ((child.offsetHeight - name.offsetHeight) * ((child.offsetWidth / 2) - (window.innerWidth * 0.015))) / child.offsetWidth
                    }
                    else {
                        this.second_column_height += child.offsetHeight
                    }
                    child.style.setProperty("padding-left", "calc(var(--vw, 1vw) * 1.5)")
                }
            }
        },
        imageLoaded(src) {
            return new Promise((resolve, reject) => {
                let img = new Image()
                img.onload = () => {
                    resolve(true)
                }
                img.onerror = reject
                img.src = src
            })
        }
    }
}
</script>
<style lang="scss" scoped>
* {
    border: none;
}
div.list {
    position: relative;
    margin-left: calc(var(--vw, 1vw) * 3);
    margin-right: calc(var(--vw, 1vw) * 3);
}
</style>
<style lang="scss">
.list {
    .child {
        position: absolute;
        left: 0;
        top: 0;

        .thumbnail {
            width: 100%;
            border-radius: calc(var(--vw, 1vw) * 3);
        }
        .name {
            text-align: left;
            font-weight: 500;
            font-size: 15px;
            height: calc(var(--vw, 1vw) * 9);
            padding-left: calc(var(--vw, 1vw) * 1.5);
            padding-right:calc(var(--vw, 1vw) * 1.5);
            padding-top: calc(var(--vw, 1vw) * 1);
        }

        .ownerIcon {
            position: absolute;
            z-index: 1;
            transition: top 0.2s ease, right 0.3s ease;
        }
    }
}
.list.singleColumn {
    .child {
        width: 100%;
        
        .ownerIcon {
            top: calc(var(--vw, 1vw) * 3);
            right: calc(var(--vw, 1vw) * 3);
        }
    }
}
.list.doubleColumn {
    .child {
        width: 50%;

        .ownerIcon {
            top: calc(var(--vw, 1vw) * 1);
            right: calc(var(--vw, 1vw) * 1);
        }
    }
}
</style>