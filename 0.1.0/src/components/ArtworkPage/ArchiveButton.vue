<template>
    <button class="archiveButton" @click="this.archive($event)">
        <div class="notArchive inner">
            <Eyes :eye_color="'black'"></Eyes>
            <div class="phrase poppins">
                Love it
            </div>
        </div>
        <div class="archiving inner">
            <div class="eye">
                <svg class="eyelid" width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_770_1997)">
                        <path
                            d="M2.30216 11.5466C2.30216 11.5466 2.44751 10.9129 2.61627 10.3153L2.84454 9.59986C4.40435 5.27625 7.95904 2.68422 12.7565 2.68422C17.554 2.68422 21.6511 5.79796 22.65 9.58915L22.6529 9.59889C22.6773 9.70012 22.848 10.4155 22.9348 11.0161C22.9631 11.2137 22.9826 11.3986 22.9846 11.5456H25.0789C25.076 11.4541 25.0984 11.2565 25.0828 11.1708C23.9727 4.86452 19.2192 0.720001 12.7565 0.720001C5.12621 0.720001 0 6.45887 0 15C0 23.5411 5.2462 29.28 12.7565 29.28C18.5519 29.28 23.0587 26.0232 24.5941 20.9355H22.4763C21.0316 24.5378 18.0125 27.3148 12.7565 27.3148C6.40508 27.3148 1.96854 22.2505 1.96854 14.999C1.96854 13.8349 2.07292 12.736 2.27095 11.7091C2.28168 11.6546 2.29046 11.6001 2.30216 11.5456V11.5466Z"
                            fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_770_1997">
                            <rect width="25.0877" height="28.56" fill="white" transform="translate(0 0.720001)" />
                        </clipPath>
                    </defs>
                </svg>
                <svg class="pupil" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.432 7.01541C8.85113 7.83497 7.85223 8.83265 7.03086 13.4025C6.98697 13.6498 6.63091 13.6498 6.58701 13.4025C5.76565 8.83168 4.76577 7.83497 0.185831 7.01541C-0.0619438 6.97161 -0.0619438 6.61634 0.185831 6.57254C4.76675 5.75298 5.76565 4.7553 6.58701 0.185423C6.63091 -0.0618076 6.98697 -0.0618076 7.03086 0.185423C7.85223 4.75627 8.85211 5.75298 13.432 6.57254C13.6798 6.61634 13.6798 6.97161 13.432 7.01541Z"
                        fill="black" />
                </svg>
            </div>
            <div class="eye">
                <svg class="eyelid" width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_770_1997)">
                        <path
                            d="M2.30216 11.5466C2.30216 11.5466 2.44751 10.9129 2.61627 10.3153L2.84454 9.59986C4.40435 5.27625 7.95904 2.68422 12.7565 2.68422C17.554 2.68422 21.6511 5.79796 22.65 9.58915L22.6529 9.59889C22.6773 9.70012 22.848 10.4155 22.9348 11.0161C22.9631 11.2137 22.9826 11.3986 22.9846 11.5456H25.0789C25.076 11.4541 25.0984 11.2565 25.0828 11.1708C23.9727 4.86452 19.2192 0.720001 12.7565 0.720001C5.12621 0.720001 0 6.45887 0 15C0 23.5411 5.2462 29.28 12.7565 29.28C18.5519 29.28 23.0587 26.0232 24.5941 20.9355H22.4763C21.0316 24.5378 18.0125 27.3148 12.7565 27.3148C6.40508 27.3148 1.96854 22.2505 1.96854 14.999C1.96854 13.8349 2.07292 12.736 2.27095 11.7091C2.28168 11.6546 2.29046 11.6001 2.30216 11.5456V11.5466Z"
                            fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_770_1997">
                            <rect width="25.0877" height="28.56" fill="white" transform="translate(0 0.720001)" />
                        </clipPath>
                    </defs>
                </svg>
                <svg class="pupil" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.432 7.01541C8.85113 7.83497 7.85223 8.83265 7.03086 13.4025C6.98697 13.6498 6.63091 13.6498 6.58701 13.4025C5.76565 8.83168 4.76577 7.83497 0.185831 7.01541C-0.0619438 6.97161 -0.0619438 6.61634 0.185831 6.57254C4.76675 5.75298 5.76565 4.7553 6.58701 0.185423C6.63091 -0.0618076 6.98697 -0.0618076 7.03086 0.185423C7.85223 4.75627 8.85211 5.75298 13.432 6.57254C13.6798 6.61634 13.6798 6.97161 13.432 7.01541Z"
                        fill="black" />
                </svg>
            </div>
        </div>
        <div class="archived inner">
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M2.68884 10.3153C2.5154 10.9129 2.36602 11.5466 2.36602 11.5466V11.5456C2.3588 11.5783 2.35267 11.611 2.34653 11.6437C2.34244 11.6655 2.33835 11.6873 2.33394 11.7091C2.13042 12.736 2.02315 13.8349 2.02315 14.999C2.02315 22.2505 6.58276 27.3148 13.1104 27.3148C18.5121 27.3148 21.615 24.5378 23.0998 20.9355H25.2763C23.6983 26.0232 19.0665 29.28 13.1104 29.28C5.39173 29.28 0 23.5411 0 15C0 6.45887 5.26841 0.720001 13.1104 0.720001C19.7523 0.720001 24.6377 4.86452 25.7786 11.1708C25.7885 11.2238 25.7835 11.3196 25.7789 11.4066C25.7761 11.4603 25.7735 11.5107 25.7746 11.5456H23.6221C23.6201 11.3986 23.6001 11.2137 23.571 11.0161C23.4818 10.4155 23.3063 9.70012 23.2813 9.59889L23.2783 9.58916C22.2516 5.79796 18.0409 2.68422 13.1104 2.68422C8.17982 2.68422 4.52652 5.27625 2.92344 9.59986L2.68884 10.3153ZM5.85278 15.001C5.85278 10.5975 9.0038 7.02826 12.8917 7.02826C16.7786 7.02826 19.9306 10.5975 19.9306 15.001C19.9306 19.4044 16.7786 22.9737 12.8917 22.9737C9.00481 22.9737 5.85278 19.4044 5.85278 15.001ZM11.0099 16.3004C11.0701 16.5603 11.451 16.5603 11.5112 16.3004C11.8962 14.6321 12.4586 14.0821 14.1639 13.7054C14.4316 13.6461 14.4316 13.2762 14.1639 13.2168C12.4586 12.8401 11.8962 12.2902 11.5112 10.6219C11.451 10.362 11.0701 10.362 11.0099 10.6219C10.6249 12.2902 10.0625 12.8401 8.35716 13.2168C8.08948 13.2762 8.08948 13.6461 8.35716 13.7054C10.0625 14.0821 10.6249 14.6321 11.0099 16.3004ZM15.0963 20.0906C15.3089 19.1727 15.6176 18.87 16.556 18.6627C16.7034 18.6306 16.7034 18.4262 16.556 18.3941C15.6176 18.1867 15.3079 17.884 15.0963 16.9662C15.0632 16.8231 14.8537 16.8231 14.8206 16.9662C14.6091 17.884 14.2993 18.1867 13.3609 18.3941C13.2135 18.4262 13.2135 18.6306 13.3609 18.6627C14.2993 18.87 14.6091 19.1727 14.8206 20.0906C14.8537 20.2337 15.0632 20.2337 15.0963 20.0906Z"
                    fill="black" />
            </svg>
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M2.68884 10.3153C2.5154 10.9129 2.36602 11.5466 2.36602 11.5466V11.5456C2.3588 11.5783 2.35267 11.611 2.34653 11.6437C2.34244 11.6655 2.33835 11.6873 2.33394 11.7091C2.13042 12.736 2.02315 13.8349 2.02315 14.999C2.02315 22.2505 6.58276 27.3148 13.1104 27.3148C18.5121 27.3148 21.615 24.5378 23.0998 20.9355H25.2763C23.6983 26.0232 19.0665 29.28 13.1104 29.28C5.39173 29.28 0 23.5411 0 15C0 6.45887 5.26841 0.720001 13.1104 0.720001C19.7523 0.720001 24.6377 4.86452 25.7786 11.1708C25.7885 11.2238 25.7835 11.3196 25.7789 11.4066C25.7761 11.4603 25.7735 11.5107 25.7746 11.5456H23.6221C23.6201 11.3986 23.6001 11.2137 23.571 11.0161C23.4818 10.4155 23.3063 9.70012 23.2813 9.59889L23.2783 9.58916C22.2516 5.79796 18.0409 2.68422 13.1104 2.68422C8.17982 2.68422 4.52652 5.27625 2.92344 9.59986L2.68884 10.3153ZM5.85278 15.001C5.85278 10.5975 9.0038 7.02826 12.8917 7.02826C16.7786 7.02826 19.9306 10.5975 19.9306 15.001C19.9306 19.4044 16.7786 22.9737 12.8917 22.9737C9.00481 22.9737 5.85278 19.4044 5.85278 15.001ZM11.0099 16.3004C11.0701 16.5603 11.451 16.5603 11.5112 16.3004C11.8962 14.6321 12.4586 14.0821 14.1639 13.7054C14.4316 13.6461 14.4316 13.2762 14.1639 13.2168C12.4586 12.8401 11.8962 12.2902 11.5112 10.6219C11.451 10.362 11.0701 10.362 11.0099 10.6219C10.6249 12.2902 10.0625 12.8401 8.35716 13.2168C8.08948 13.2762 8.08948 13.6461 8.35716 13.7054C10.0625 14.0821 10.6249 14.6321 11.0099 16.3004ZM15.0963 20.0906C15.3089 19.1727 15.6176 18.87 16.556 18.6627C16.7034 18.6306 16.7034 18.4262 16.556 18.3941C15.6176 18.1867 15.3079 17.884 15.0963 16.9662C15.0632 16.8231 14.8537 16.8231 14.8206 16.9662C14.6091 17.884 14.2993 18.1867 13.3609 18.3941C13.2135 18.4262 13.2135 18.6306 13.3609 18.6627C14.2993 18.87 14.6091 19.1727 14.8206 20.0906C14.8537 20.2337 15.0632 20.2337 15.0963 20.0906Z"
                    fill="black" />
            </svg>
        </div>
    </button>
</template>
<script>
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'
    import Eyes from '@/widgets/Eyes.vue';

    export default {
        name: 'ArchiveButton',
        components: {
            Eyes
        },
        props: {
            artwork: {
                type: Object,
                default: null
            },
            exhibition: {
                type: Object,
                default: null
            },
        },
        data() {
            return {
            };
        },
        watch: {
            artwork: {
                deep: false,
                async handler() {
                    await this.setButtonAnimation()
                }
            },
        },
        data() {
            return {
                /*
                * 아카이브 중인지를 지정하는 data.
                * double click 막기 위한 data.
                */
                archiveInProgress: false,
                /*
                * archiveButton의 현재 상태를 지정하는 data.
                * 만약 login 되어있지 않거나 archive한 작품이 아니라면 false.
                * login되어있고 archive한 작품이라면 true.
                */
                archiveStatus: false,
                not_archive_element: null,
                archiving_element: null,
                archived_element: null,
                timeOutInterval: null,
                user: null
            };
        },
        created () {
            if (isAuth()) {
                this.user = getAuth()
            }
        },
        async mounted() {
            this.not_archive_element = document.getElementsByClassName('notArchive')[0]
            this.archiving_element = document.getElementsByClassName('archiving')[0]
            this.archived_element = document.getElementsByClassName('archived')[0]
        },
        methods: {
            async setButtonAnimation () {
                let is_archive
                if (isAuth() && (this.artwork || this.exhibition)) {
                    if (this.artwork)
                        is_archive = await this.user.isArtworkArchived(this.artwork)
                    else if (this.exhibition)
                        is_archive = await this.user.isExhibitionArchived(this.exhibition)
                    else
                        is_archive = false
                }
                else {
                    is_archive = false
                }
                clearInterval(this.timeOutInterval)
                if (is_archive) {
                    this.not_archive_element.classList.remove('show')
                    this.not_archive_element.classList.remove('activate')
                    this.archived_element.classList.add('show')
                    this.archived_element.classList.add('activate')
                }
                else {
                    this.archived_element.classList.remove('show')
                    this.archived_element.classList.remove('activate')
                    this.archiving_element.classList.remove('show')
                    this.archiving_element.classList.remove('activate')
                    this.not_archive_element.classList.add('show')
                    this.not_archive_element.classList.add('activate')
                }
            },
            async archive (event) {
                // event 전파 방지
                if (event.stopPropagation) event.stopPropagation();
                else event.cancelBubble = true; // IE 대응

                if (this.archiveInProgress) {
                    return
                }
                this.archiveInProgress = true

                // No authorization information
                if (!isAuth()) {
                    if (process.env.NODE_ENV === 'production') {
                        this.$gtag.event('click', {
                            event_category: 'artwork',
                            event_label: 'archive',
                            value: this.artwork.getID()
                        })
                    }
                    this.$router.replace({
                        path: '/login',
                        query: {
                            redirect: this.$route.fullPath
                        }
                    })
                }
                // Authorized user exist
                else {
                    let is_archive = false
                    if (this.artwork) {
                        is_archive = await this.user.isArtworkArchived(this.artwork)
                    }
                    else if (this.exhibition) {
                        is_archive = await this.user.isExhibitionArchived(this.exhibition)
                    }
                    
                    if (this.user === null) {
                        this.user = getAuth()
                    }
                    
                    if (this.not_archive_element === null || this.archiving_element === null || this.archived_element === null) {
                        this.setButtonAnimation()
                    }

                    if (is_archive) {
                        clearTimeout(this.timeOutInterval)
                        this.archived_element.classList.remove('show')
                        this.archiving_element.classList.remove('show')
                        this.archived_element.classList.remove('activate')
                        this.archiving_element.classList.remove('activate')
                        this.not_archive_element.classList.add('show')
                        this.not_archive_element.classList.add('activate')

                        if (this.artwork) {
                            await this.user.putArtworkUnarchive(this.artwork)
                            this.$emit('set-archive-popup', false)
                        }
                        else if (this.exhibition) {
                            await this.user.putExhibitionUnarchive(this.exhibition)
                        }
                    } 
                    else {
                        this.not_archive_element.classList.remove('show')
                        this.not_archive_element.classList.remove('activate')
                        this.archiving_element.classList.add('show')
                        this.archiving_element.classList.add('activate')
                        const _this = this
                        this.timeOutInterval = setTimeout(function() {
                            _this.archiving_element.classList.remove('show')
                            _this.archiving_element.classList.remove('activate')
                            _this.archived_element.classList.add('show')
                            _this.archived_element.classList.add('activate')
                        }, 1000)
                        
                        if (this.artwork) {
                            await this.user.putArtworkArchive(this.artwork)
                            this.$emit('set-archive-popup', true)
                        }
                        else if (this.exhibition) {
                            await this.user.putExhibitionArchive(this.exhibition)
                        }
                        if (process.env.NODE_ENV === 'production') {
                            this.$gtag.event('click', {
                                event_category: 'artwork',
                                event_label: 'archive',
                                value: this.artwork.getID()
                            })
                        }
                    }
                }

                this.archiveInProgress = false
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/archiveButton.scss"></style>