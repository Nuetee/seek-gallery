<template>
    <button class="profileShareButton" @click="this.copyURL()">
        프로필 링크 복사
    </button>
</template>
<script>
    import { getAuth } from '@/modules/auth';

    export default {
        name: '',
        components: {},
        data() {
            return {
                sampleData: ''
            };
        },
        methods: {
            copyURL () {
                let dummy = document.createElement("input");
                let url = location.href;
                
                document.body.appendChild(dummy);
                dummy.value = url;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
                this.$gtag.event('click', {
                    event_category: 'user',
                    event_label: 'copy',
                    value: getAuth().getID()
                })

                alert("페이지 주소를 클립보드에 복사했습니다.");
            }
        }
    }
</script>
<style lang="scss" scoped src="../../scss/MyPage/profileShareButton.scss"></style>