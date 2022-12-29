<template>
    <div class="artworkTableInfo">
        <div class="tableCell">
            <div class="label">재료</div>
            <div class="content">{{ this.artwork ? this.artwork.getMaterial() : '' }}</div>
        </div>
        <div class="division">
            <div class="line"></div>
        </div>
        <div class="tableCell">
            <div class="label">사이즈</div>
            <div class="content">{{ this.artwork ? this.artwork.getDimension() : '' }}</div>
        </div>
        <div class="division">
            <div class="line"></div>
        </div>
        <div class="tableCell">
            <div class="label">제작연도</div>
            <div class="content">{{ this.artwork ? this.artwork.getYear() : '' }}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ArtworkTableInfo',
        components: {},
        props: {
            artwork: Object
        },
        data() {
            return {
                sampleData: ''
            };
        },
    }
</script>
<style lang="scss" scoped src="../../scss/ArtworkPage/artworkTableInfo.scss"></style>