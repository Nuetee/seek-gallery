<template>
    <button class="archiveButton" @click="this.archive($event)">
        <div class="notArchive inner">
            <div class="eye">
                <svg class="eyelid" width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.0002 0C13.1921 0 8.67214 1.76831 5.27225 4.97929C1.87235 8.19028 0 12.4591 0 17C0 21.5409 1.87235 25.8101 5.27225 29.0207C8.67179 32.2317 13.1921 34 18.0002 34C22.8083 34 27.3286 32.2317 30.7281 29.0207C32.76 27.1018 34.2897 24.7367 35.1516 22.181L35.2706 21.828H33.571L33.5047 22.0114C32.6954 24.2509 31.3758 26.2454 29.5826 27.9392C26.4888 30.8611 22.3753 32.4703 17.9998 32.4703C13.6243 32.4703 9.51119 30.8611 6.41737 27.9392C3.32356 25.0173 1.70103 21.3148 1.62253 17.2918H35.4767V17.2708H36V17C36 12.4591 34.1277 8.19028 30.7278 4.97929C27.3279 1.76831 22.8079 0 17.9998 0H18.0002ZM18.0002 1.52967C22.3757 1.52967 26.4888 3.13888 29.583 6.06079C31.0027 7.40158 32.1345 8.9458 32.9474 10.6508C33.7173 12.2651 34.1814 13.9833 34.3294 15.7618H1.67128C1.81894 13.9833 2.28344 12.2654 3.05331 10.6508C3.86619 8.9458 4.99806 7.40158 6.41773 6.06079C9.51155 3.13888 13.625 1.52967 18.0002 1.52967Z" fill="white"/>
                </svg>
                <svg class="pupil" width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 8C13.1944 8 17 4.41829 17 0H0C0 4.41829 3.80556 8 8.5 8Z" fill="white"/>
                </svg>
            </div>
            <div class="eye">
                <svg class="eyelid" width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.0002 0C13.1921 0 8.67214 1.76831 5.27225 4.97929C1.87235 8.19028 0 12.4591 0 17C0 21.5409 1.87235 25.8101 5.27225 29.0207C8.67179 32.2317 13.1921 34 18.0002 34C22.8083 34 27.3286 32.2317 30.7281 29.0207C32.76 27.1018 34.2897 24.7367 35.1516 22.181L35.2706 21.828H33.571L33.5047 22.0114C32.6954 24.2509 31.3758 26.2454 29.5826 27.9392C26.4888 30.8611 22.3753 32.4703 17.9998 32.4703C13.6243 32.4703 9.51119 30.8611 6.41737 27.9392C3.32356 25.0173 1.70103 21.3148 1.62253 17.2918H35.4767V17.2708H36V17C36 12.4591 34.1277 8.19028 30.7278 4.97929C27.3279 1.76831 22.8079 0 17.9998 0H18.0002ZM18.0002 1.52967C22.3757 1.52967 26.4888 3.13888 29.583 6.06079C31.0027 7.40158 32.1345 8.9458 32.9474 10.6508C33.7173 12.2651 34.1814 13.9833 34.3294 15.7618H1.67128C1.81894 13.9833 2.28344 12.2654 3.05331 10.6508C3.86619 8.9458 4.99806 7.40158 6.41773 6.06079C9.51155 3.13888 13.625 1.52967 18.0002 1.52967Z" fill="white"/>
                </svg>
                <svg class="pupil" width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 8C13.1944 8 17 4.41829 17 0H0C0 4.41829 3.80556 8 8.5 8Z" fill="white"/>
                </svg>
            </div>
            <div class="phrase poppins">
                Archive
            </div>
        </div>
        <div class="archiving inner">
            <div class="eye">
                <svg class="eyelid" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.2302 23.0109C30.4525 24.8496 29.3387 26.5015 27.9199 27.9203C26.5012 29.339 24.8496 30.4528 23.0105 31.2305C21.1075 32.0354 19.0853 32.4435 16.9998 32.4435C14.9144 32.4435 12.8922 32.0354 10.9891 31.2305C9.1504 30.4528 7.49881 29.339 6.07973 27.9203C4.66099 26.5015 3.54719 24.8499 2.76945 23.0109C1.96464 21.1078 1.55648 19.0856 1.55648 17.0002C1.55648 14.9147 1.96464 12.8925 2.76945 10.9895C3.54719 9.15073 4.66099 7.49881 6.07973 6.08007C7.49847 4.66133 9.15006 3.54753 10.9891 2.76979C12.8922 1.96498 14.9144 1.55682 16.9998 1.55682C19.0853 1.55682 21.1075 1.96498 23.0105 2.76979C24.8493 3.54753 26.5009 4.66133 27.9199 6.08007C29.3387 7.49881 30.4525 9.15073 31.2302 10.9895C32.035 12.8925 32.4432 14.9147 32.4432 17.0002C32.4432 17.0919 32.4422 17.1833 32.4405 17.275H33.9976C33.999 17.1836 34 17.0922 34 17.0002C34 7.61117 26.3888 0 16.9998 0C7.61083 0 0 7.61117 0 17.0002C0 26.3892 7.61117 34 16.9998 34C24.7044 34 31.2116 28.8747 33.2988 21.8476H31.6675C31.5379 22.2399 31.392 22.6277 31.2302 23.0105V23.0109Z" fill="black"/>
                </svg>
                <svg class="pupil" width="18" height="18" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.808644 19.224C14.9133 17.481 17.3527 14.9704 18.69 0.821524C18.7445 0.244518 19.5827 0.232508 19.6538 0.807807C21.3969 14.9125 23.9072 17.3521 38.0561 18.6895C38.6331 18.744 38.6451 19.5821 38.0699 19.6533C23.9652 21.3963 21.5255 23.9067 20.1882 38.0556C20.1337 38.6326 19.2955 38.6446 19.2244 38.0693C17.4813 23.9646 14.971 21.525 0.822068 20.1876C0.245062 20.1331 0.233052 19.295 0.808351 19.2238L0.808644 19.224Z" fill="black"/>
                </svg>
            </div>
            <div class="eye">
                <svg class="eyelid" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.2302 23.0109C30.4525 24.8496 29.3387 26.5015 27.9199 27.9203C26.5012 29.339 24.8496 30.4528 23.0105 31.2305C21.1075 32.0354 19.0853 32.4435 16.9998 32.4435C14.9144 32.4435 12.8922 32.0354 10.9891 31.2305C9.1504 30.4528 7.49881 29.339 6.07973 27.9203C4.66099 26.5015 3.54719 24.8499 2.76945 23.0109C1.96464 21.1078 1.55648 19.0856 1.55648 17.0002C1.55648 14.9147 1.96464 12.8925 2.76945 10.9895C3.54719 9.15073 4.66099 7.49881 6.07973 6.08007C7.49847 4.66133 9.15006 3.54753 10.9891 2.76979C12.8922 1.96498 14.9144 1.55682 16.9998 1.55682C19.0853 1.55682 21.1075 1.96498 23.0105 2.76979C24.8493 3.54753 26.5009 4.66133 27.9199 6.08007C29.3387 7.49881 30.4525 9.15073 31.2302 10.9895C32.035 12.8925 32.4432 14.9147 32.4432 17.0002C32.4432 17.0919 32.4422 17.1833 32.4405 17.275H33.9976C33.999 17.1836 34 17.0922 34 17.0002C34 7.61117 26.3888 0 16.9998 0C7.61083 0 0 7.61117 0 17.0002C0 26.3892 7.61117 34 16.9998 34C24.7044 34 31.2116 28.8747 33.2988 21.8476H31.6675C31.5379 22.2399 31.392 22.6277 31.2302 23.0105V23.0109Z" fill="black"/>
                </svg>
                <svg class="pupil" width="18" height="18" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.808644 19.224C14.9133 17.481 17.3527 14.9704 18.69 0.821524C18.7445 0.244518 19.5827 0.232508 19.6538 0.807807C21.3969 14.9125 23.9072 17.3521 38.0561 18.6895C38.6331 18.744 38.6451 19.5821 38.0699 19.6533C23.9652 21.3963 21.5255 23.9067 20.1882 38.0556C20.1337 38.6326 19.2955 38.6446 19.2244 38.0693C17.4813 23.9646 14.971 21.525 0.822068 20.1876C0.245062 20.1331 0.233052 19.295 0.808351 19.2238L0.808644 19.224Z" fill="black"/>
                </svg>
            </div>
        </div>
        <div class="archived inner">
            <div class="eye">
                <svg class="eyelid" version="1.0" xmlns="http://www.w3.org/2000/svg" width="372.000000pt" height="372.000000pt" viewBox="0 0 372.000000 372.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,372.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path d="M1690 3713 c-656 -62 -1227 -461 -1510 -1055 -298 -628 -222 -1370
                    198 -1923 266 -350 655 -598 1090 -695 263 -58 584 -51 860 19 523 134 971
                    503 1207 993 48 100 105 246 105 270 0 4 -39 8 -88 8 l-87 0 -24 -67 c-34 -96
                    -118 -255 -192 -365 -82 -122 -302 -342 -424 -425 -588 -399 -1321 -404 -1912
                    -12 -148 99 -351 302 -452 453 -205 309 -305 659 -288 1016 16 322 109 607
                    288 877 99 148 302 351 453 452 309 205 659 305 1016 288 322 -16 607 -109
                    877 -288 136 -91 349 -301 440 -434 126 -186 214 -385 259 -585 25 -114 44
                    -266 44 -355 l0 -55 87 0 86 0 -6 128 c-43 837 -639 1538 -1465 1721 -153 35
                    -403 50 -562 34z"/>
                    <path d="M1696 2735 c-339 -71 -592 -301 -692 -630 -24 -81 -27 -106 -28 -240
                    0 -178 18 -258 88 -400 111 -223 306 -387 551 -461 81 -24 106 -27 240 -28
                    178 0 258 18 400 88 223 111 387 306 461 551 24 81 27 106 28 240 0 124 -4
                    164 -22 230 -85 309 -312 540 -619 631 -111 32 -300 41 -407 19z m14 -457 c17
                    -92 48 -154 92 -192 35 -30 69 -44 208 -84 41 -12 26 -25 -49 -44 -156 -38
                    -211 -93 -249 -249 -19 -75 -32 -90 -44 -49 -4 14 -16 57 -27 95 -22 77 -63
                    135 -114 162 -18 9 -68 27 -111 38 -82 22 -106 40 -64 49 99 21 130 31 176 57
                    64 36 105 102 128 207 20 90 37 93 54 10z m510 -590 c24 -100 71 -148 166
                    -169 30 -7 51 -16 47 -20 -4 -4 -34 -14 -65 -23 -91 -26 -129 -71 -152 -178
                    -9 -42 -21 -34 -35 24 -22 95 -75 146 -173 163 -21 4 -38 10 -38 14 0 4 28 15
                    62 25 84 23 131 70 148 149 7 31 17 57 21 57 5 0 13 -19 19 -42z"/>
                    </g>
                </svg>
            </div>
            <div class="eye">
                <svg class="eyelid" version="1.0" xmlns="http://www.w3.org/2000/svg" width="372.000000pt" height="372.000000pt" viewBox="0 0 372.000000 372.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,372.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path d="M1690 3713 c-656 -62 -1227 -461 -1510 -1055 -298 -628 -222 -1370
                    198 -1923 266 -350 655 -598 1090 -695 263 -58 584 -51 860 19 523 134 971
                    503 1207 993 48 100 105 246 105 270 0 4 -39 8 -88 8 l-87 0 -24 -67 c-34 -96
                    -118 -255 -192 -365 -82 -122 -302 -342 -424 -425 -588 -399 -1321 -404 -1912
                    -12 -148 99 -351 302 -452 453 -205 309 -305 659 -288 1016 16 322 109 607
                    288 877 99 148 302 351 453 452 309 205 659 305 1016 288 322 -16 607 -109
                    877 -288 136 -91 349 -301 440 -434 126 -186 214 -385 259 -585 25 -114 44
                    -266 44 -355 l0 -55 87 0 86 0 -6 128 c-43 837 -639 1538 -1465 1721 -153 35
                    -403 50 -562 34z"/>
                    <path d="M1696 2735 c-339 -71 -592 -301 -692 -630 -24 -81 -27 -106 -28 -240
                    0 -178 18 -258 88 -400 111 -223 306 -387 551 -461 81 -24 106 -27 240 -28
                    178 0 258 18 400 88 223 111 387 306 461 551 24 81 27 106 28 240 0 124 -4
                    164 -22 230 -85 309 -312 540 -619 631 -111 32 -300 41 -407 19z m14 -457 c17
                    -92 48 -154 92 -192 35 -30 69 -44 208 -84 41 -12 26 -25 -49 -44 -156 -38
                    -211 -93 -249 -249 -19 -75 -32 -90 -44 -49 -4 14 -16 57 -27 95 -22 77 -63
                    135 -114 162 -18 9 -68 27 -111 38 -82 22 -106 40 -64 49 99 21 130 31 176 57
                    64 36 105 102 128 207 20 90 37 93 54 10z m510 -590 c24 -100 71 -148 166
                    -169 30 -7 51 -16 47 -20 -4 -4 -34 -14 -65 -23 -91 -26 -129 -71 -152 -178
                    -9 -42 -21 -34 -35 24 -22 95 -75 146 -173 163 -21 4 -38 10 -38 14 0 4 28 15
                    62 25 84 23 131 70 148 149 7 31 17 57 21 57 5 0 13 -19 19 -42z"/>
                    </g>
                </svg>
            </div>
        </div>
    </button>
</template>
<script>
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'

    export default {
        name: 'ArchiveButton',
        components: {},
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
                    let color = this.artwork ? this.artwork.getColor() : 'black'
                    // artwork.getColor()의 값에 따라 Archive button의 배경 및 색상 변경
                    if (color === 'black') {
                        document.getElementsByClassName('archiveButton')[0].style.setProperty('--background-color', 'black')
                        document.getElementsByClassName('archiveButton')[0].style.
                        setProperty('--color', 'white')
                    }
                    else if (color === 'white') {
                        document.getElementsByClassName('archiveButton')[0].style.setProperty('--background-color', 'white')
                        document.getElementsByClassName('archiveButton')[0].style.
                        setProperty('--color', 'black')
                    }
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
            console.log(this.not_archive_element)
            this.archiving_element = document.getElementsByClassName('archiving')[0]
            this.archived_element = document.getElementsByClassName('archived')[0]

            if (this.exhibition) {
                console.log(this.exhibition)
                document.getElementsByClassName('archiveButton')[0].style.setProperty('--background-color', '#CCFF00')
                document.getElementsByClassName('archiveButton')[0].style.
                    setProperty('--color', '#000000')
                await this.setButtonAnimation()
            }
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