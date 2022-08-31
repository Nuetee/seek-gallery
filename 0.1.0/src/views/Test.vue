<template>
    <div id="test">

    </div>
</template>
<script>
    export default {
        name: '',
        components: {},
        data() {
            return {
                sampleData: ''
            };
        },
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {
            const promise = this.test(21)
            let result
            result = promise.then((value) => {
                return value
            })
            console.log(result)
        },
        beforeUpdate() {},
        updated() {},
        beforeUnmount() {},
        unmounted() {},
        methods: {
            test (age) {
                return new Promise((resolve, reject) => {
                    if(age > 20) resolve(true);
                    else reject(new Error(false))
                })
            }
        }
    }
</script>