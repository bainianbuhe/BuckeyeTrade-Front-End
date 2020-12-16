

<template >
<div id="app">
  <router-view></router-view>
</div>
</template>
<script>

var user={
  name:"default in data",
  age:11
};
var name="default";
export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      user,
      name
    }
  }
  , methods: {

  }

}
</script>

<style>

html,body,#app{
  height: 100%;
  margin:0px;
  padding: 0px;
}
body{
  background-position: center center;
  background-repeat:  no-repeat;
  background-image: url("./assets/background.jpg");
  background-attachment:fixed;
}
</style>


