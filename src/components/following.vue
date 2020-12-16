<template>
  <div class="login-box">
    <el-row style="height:100%;margin-left:80px">
      <el-col span="10" style="position: relative;height: 100%;">
        <div class="title">My followings</div>
        <div v-for="item in followingList">
          <el-card   shadow="always" class="unsold-card">
            <el-row type="flex"
                    align="middle">
              <el-col span="4">   <el-avatar shape="circle" :size="50" fit="fill" :src="item.avatarUrl"></el-avatar></el-col>
              <el-col span="8"> <span class="user-name"> {{item.userName}} </span></el-col>
              <el-col span="6">  <span class="college-or-school">{{item.collegeOrSchool}}</span></el-col>
              <el-col span="8"> <el-button type="primary" v-on:click="unFollow(item.userId,item.userName)">Unfollow</el-button></el-col>
            </el-row>
          </el-card>
        </div>
        <div style="position:absolute;bottom:10px;left:30%">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-count="followingPageCount"
              v-bind:current-page.sync="currentFollowingPage"
              v-on:current-change="loadFollowingPage"
              style="width: 100%">
          </el-pagination>
        </div>
      </el-col>
      <el-col span="2"><div style="width: 100%"></div></el-col>
      <el-col span="10" style="position: relative;height: 100%;">
        <div class="title">My Followers</div>
        <div v-for="item in followerList">
          <el-card   shadow="always" class="unsold-card">
            <el-row type="flex"
                    align="middle">
              <el-col span="8">   <el-avatar shape="circle" :size="50" fit="fill" :src="item.avatarUrl"></el-avatar></el-col>
              <el-col span="8"> <span class="user-name"> {{item.userName}} </span></el-col>
              <el-col span="8">  <span class="college-or-school">{{item.collegeOrSchool}}</span></el-col>
            </el-row>
          </el-card>
        </div>
        <div style="position:absolute;bottom:10px;left:30%">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-count="followerPageCount"
              v-bind:current-page.sync="currentFollowerPage"
              v-on:current-change="loadFollowerPage"
              style="width: 100%">
          </el-pagination>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import config from "../static/config"
export default {
  name: "myPosts",
  data:function(){
    return{
      followerPageCount:0,
      followingPageCount:0,
      currentFollowingPage:1,
      currentFollowerPage:1,
      followingList:[],
      followerList:[],
      userId:0,
    }
  },
  methods:{
    loadFollowingPage(pageNum){
      this.axios.get(config.serverAdress1+":8079/following-vos?pageNum="+pageNum+"&pageSize=6&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.followingList=resJSON.data;
            this.followingPageCount=resJSON.pageCount;
          }
      )
    },
    loadFollowerPage(pageNum){
      this.axios.get(config.serverAdress1+":8079/follower-vos?pageNum="+pageNum+"&pageSize=6&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.followerList=resJSON.data;
            this.followerPageCount=resJSON.pageCount;
          }
      )
    },
    unFollow(followedUserId,followedUserName){
      this.axios.get(config.serverAdress1+":8079/un-follow?followedUserId="+followedUserId+"&followerId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            if(resJSON.message=="success"){
              this.$message.success("Successfully unfollowed user"+followedUserName)
            }
            this.loadFollowingPage(this.currentFollowingPage);
            this.loadFollowerPage(this.currentFollowerPage);
          }
      )
    }
  },
  mounted(){
    console.log("mounted")
    this.userId=JSON.parse(sessionStorage.getItem("userData")).userId;
    console.log(this.userId)
    this.currentFollowingPage=1;
    this.currentFollowerPage=1;
    this.loadFollowingPage(1);
    this.loadFollowerPage(1);
  }
}
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 1200px;
  height: 850px;
  margin: 50px auto;
  padding: 35px 35px 35px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: #eeeeee;
  text-align: center;
}
.unsold-card{

  width: 100%;
  margin-bottom: 10px;
  position: relative
}
.sold-card{
  width: 100%;
  position: relative;
  margin-bottom: 10px;
}
.title{
  font-weight: bold;
  font-size:30px;
  margin-bottom: 20px;
}
.itemName{
  font-size: 16px;
  color: #303133;

}
.college-or-school {
  font-size: 14px;
  color:gray;
  margin-left: 5px;
}
.user-name {
  font-size: 16px;
  font-weight:bold;
  margin-left: 5px;
  margin-right: 10px;
}
.el-col {
  min-height: 1px
}
</style>