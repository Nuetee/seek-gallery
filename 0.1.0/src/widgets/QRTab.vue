<template>
    <div class="qrTab tab">
        <ArtworkCardList v-if="this.loadFlag" :exhibitionIdList="this.qrList" :tabClass="'qrTab'"></ArtworkCardList>
    </div>
</template>
<script>
    import ArtworkCardList from './ArtworkCardList.vue';
    import { isAuth, getAuth } from '@/modules/auth';

    export default {
        name: 'ExhibtionTab',
        components: {
            ArtworkCardList
        },
        data() {
            return {
                user: null,
                qrList: [],
                nothingToUpdate: false,
                loadFlag: false
            };
        },
        beforeCreate() {},
        async created() {
            if(isAuth()) {
                this.user = getAuth()
                await this.rebuild(0, 12)
            }
            else {
                this.nothingToUpdate = true
            }
            this.loadFlag = true
        },
        methods: {
            async rebuild (offset, length) {
                const newQRList = await this.user.getArchiveExhibitions(offset, length)
                this.qrList = this.qrList.concat(newQRList)
                if (newQRList.length < 12) {
                    this.nothingToUpdate = true
                }
            },
            async load () {
                if (!this.nothingToUpdate) {
                    await this.rebuild(this.qrList.length, 12)
                }
            }
        }
    }
</script>