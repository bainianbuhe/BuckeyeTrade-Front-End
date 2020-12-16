<template>
  <el-button  v-on:click="goToLogin">login页面</el-button>
</template>

<script>
export default {
name: "home",
  methods:{
    goToLogin:function(){
      this.$router.push({name:"Login"});
    }

  }
}
</script>

<style scoped>

</style>