<template >
  <div class="homeBox" >
    <el-container >
      <el-header>
        <img src="../assets/logo.jpg" style="float:left"/>
        <el-button style="float:right" type="primary" icon="el-icon-s-home" circle  v-on:click="jumpToMainPage"></el-button>
      </el-header>
      <el-container  style=" display: flex;
    align-items: center; ">
        <el-aside width="15%"
                  class="el-aside"
                  style=" display:flex;
    align-items: center; ">
          <el-menu
              default-active="1"
              background-color="#545c64"
              text-color="#fff"
              @select="handleselect"
              style=" padding: 30px;"
              >
            <div>
              <el-avatar shape="circle" :size="75" fit="fill" :src=avatarUrl></el-avatar>
            </div>
            <el-menu-item index="1">
              <i class="el-icon-message"></i>
              <span slot="title">My Messages</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-user-solid"></i>
              <span slot="title">Following</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-setting"></i>
              <span slot="title">Edit Personal Information</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-box"></i>
              <span slot="title">My posts</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-plus"></i>
              <span slot="title">New Post</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container >

        <el-main >
          <router-view ></router-view>
        </el-main>

        </el-container>
      </el-container>
    </el-container>
    </div>
</template>

<script>
import config from "../static/config"
export default {
  name: "Profile",
  components: {},
  data:function(){
    return {
      avatarUrl: JSON.parse(sessionStorage.getItem("userData")).avatarUrl,
    }
  },
  methods:{
    handleselect:function(index,indexPath){
      switch (index){
        case '5':
        {
          this.$router.push("/profile/new-post");
          break;
        }
        case '3':
        {this.$router.push("/profile/edit-personal-information");
          break;
        }
        case '4':
        {
          console.log(index)
          this.$router.push("/profile/my-posts");
          break;
        }
        case '2':
        {
          this.$router.push("/profile/following");
          break;
        }
        case '1':
          {
            this.$router.push("/profile/message");
            break;
        }
        default:break;
      }
    },
    jumpToMainPage(){
      console.log("jump to main")
      this.$router.push("/main-page")
    }
  }
}
</script>

<style scoped>
.homeBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}

.el-aside {
  height:100%;
}
html,body,#app,.el-container{
  padding: 0px;
  margin: 0px;
  height: 100%;
}


</style>