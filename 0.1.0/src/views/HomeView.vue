<template>
  <div class="home">
    <img @click="this.test" alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { Exhibition } from '@/classes/exhibition'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  methods: {
    async test () {
      const ex = await new Exhibition('1').init()
    }
  }
}
</script>
