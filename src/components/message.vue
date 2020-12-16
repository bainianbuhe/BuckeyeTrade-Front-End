<template>
  <div class="login-box">
    <el-row style="height:100%;margin-left:80px">
      <el-col span="10" style="position: relative;height: 100%;margin-right: 20px">
        <div class="title">Read Messages</div>
        <div v-for="item in readMessageList">
          <el-card   shadow="always" class="unsold-card">
            <el-row type="flex"
                    align="middle">
              <el-col span="12"> <span class="content"> {{item.content}} </span></el-col>
              <el-col span="12">  <span class="date">{{item.createDate}}</span></el-col>
            </el-row>
          </el-card>
        </div>
        <div style="position:absolute;bottom:10px;left:30%">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-count="readMessagePageCount"
              v-bind:current-page.sync="currentReadMessagePage"
              v-on:current-change="loadReadMessagePage"
              style="width: 100%">
          </el-pagination>
        </div>
      </el-col>
      <el-col span="2"><div style="width: 100%"></div></el-col>
      <el-col span="10" style="position: relative;height: 100%;">
        <div class="title">Unread Messages</div>
        <div v-for="item in unreadMessageList">
          <el-card   shadow="always" class="unread-card">
            <el-row type="flex"
                    align="middle">
              <el-col span="18"> <div class="content"> {{item.content}} </div><div class="date">{{item.createDate}}</div></el-col>
              <el-col span="6"> <el-button style="margin-bottom: 5px" type="primary" size="small" v-on:click="check(item.checkUrl,item.notificationId)">Check</el-button>
                <el-button type="primary" size="small" v-on:click="markAsRead(item.notificationId)">Mark As Read</el-button></el-col>
            </el-row>
          </el-card>
        </div>
        <div style="position:absolute;bottom:10px;left:30%">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-count="unreadMessagePageCount"
              v-bind:current-page.sync="currentUnreadMessagePage"
              v-on:current-change="loadUnreadMessagePage"
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
      unreadMessagePageCount:0,
      readMessagePageCount:0,
      currentReadMessagePage:1,
      currentUnreadMessagePage:1,
      readMessageList:[],
      unreadMessageList:[],
      userId:0,
    }
  },
  methods:{
    loadReadMessagePage(pageNum){
      this.axios.get(config.serverAdress1+":8079/read-notifications?pageNum="+pageNum+"&pageSize=6&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            console.log("read")
            console.log(resJSON)
            this.readMessageList=resJSON.data;
            this.readMessagePageCount=resJSON.pageCount;
          }
      )
    },
    loadUnreadMessagePage(pageNum){
      this.axios.get(config.serverAdress1+":8079/unread-notifications?pageNum="+pageNum+"&pageSize=6&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.unreadMessageList=resJSON.data;
            this.unreadMessagePageCount=resJSON.pageCount;
            console.log("unread")
            console.log(resJSON)
          }
      )
    },
    check(checkUrl,notificationId){
      this.markAsRead(notificationId)
      this.$router.push(checkUrl);
    },
    markAsRead(notificationId){
      this.axios.get(config.serverAdress1+":8079/mark-as-read?notificationId="+notificationId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.loadReadMessagePage(1);
            this.loadUnreadMessagePage(1);
          }
      )
    }
  },
  mounted(){
    console.log("mounted")
    this.userId=JSON.parse(sessionStorage.getItem("userData")).userId;
    console.log(this.userId)
    this.currentReadMessagePage=1;
    this.currentUnreadMessagePage=1;
    this.loadReadMessagePage(1);
    this.loadUnreadMessagePage(1);
    console.log(this.unreadMessageList)
  }
}
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 1200px;
  height: 850px;
  margin: 50px auto;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: #eeeeee;
  text-align: center;
  padding: 35px 35px 35px 35px;
}
.unsold-card{

  width: 100%;
  margin-bottom: 10px;
  position: relative
}
.unread-card{
  width: 100%;
  height:110px;
  position: relative;
  margin-bottom: 10px;
}
.title{
  font-weight: bold;
  font-size:30px;
  margin-bottom: 20px;
}

.date {
  font-size: 14px;
  color:gray;
  margin-left: 5px;
}
.content {
  font-size: 16px;
  font-weight:bold;
  height:70px;
}

</style>