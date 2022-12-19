<template>
    <div class="subPageMy">

    </div>
</template>
<script>
    import {
        isAuth,
        getAuth
    } from '@/modules/auth'

    export default {
        name: 'SubPageMy',
        components: {},
        data() {
            return {
                user: null
            };
        },
        beforeCreate() {},
        created() {
            if (isAuth()) {
                this.user = getAuth()
            }
            else {
                
            }
        },
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {}
    }
</script>