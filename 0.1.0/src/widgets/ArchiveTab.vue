<template>
    <div class="archiveTab tab">
        <ArtworkCardList v-if="this.loadFlag" :artworkIdList="this.archivedList" :tabClass="'archiveTab'"></ArtworkCardList>
    </div>
</template>
<script>
    import ArtworkCardList from './ArtworkCardList.vue';
    import { isAuth, getAuth } from '@/modules/auth';

    export default {
        name: '',
        components: {
            ArtworkCardList
        },
        data() {
            return {
                user: null,
                archivedList: [],
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
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            async rebuild (offset, length) {
                const newArchiveList = await this.user.getArchiveArtworks(offset, length)
                this.archivedList = this.archivedList.concat(newArchiveList)
                if (newArchiveList.length < 12) {
                    this.nothingToUpdate = true
                }
            },
            async load () {
                if (!this.nothingToUpdate) {
                    await this.rebuild(this.archivedList.length, 12)
                }
            }
        }
    }
</script>