<template>
<div class="login-box">
  <el-row style="height:100%;margin-left:80px">
    <el-col span="10" style="position: relative;height: 100%;">
      <div class="title">Unsold Items</div>
      <div v-for="item in unsoldItemList">
      <el-card   shadow="always" class="unsold-card">
        <el-row type="flex"
                align="middle">
          <el-col span="6">  <a class="itemName" v-bind:href="'/item-detail/'+item.postId">{{item.itemName}}</a></el-col>
          <el-col span="4"><span class="price">{{item.price}}</span></el-col>
          <el-col span="8">  <span class="time">{{item.date}}</span></el-col>
          <el-col span="8"> <el-button type="primary" v-on:click="markAsSold(item.postId)">Mark as sold</el-button></el-col>
        </el-row>
      </el-card>
      </div>
      <div style="position:absolute;bottom:10px;left:30%">
      <el-pagination
          background
          layout="prev, pager, next"
          :page-count="unsoldPageCount"
          v-bind:current-page.sync="currentUnsoldPage"
          v-on:current-change="loadUnsoldPage"
          style="width: 100%">
      </el-pagination>
      </div>
    </el-col>
    <el-col span="2"><div style="width: 100%"></div></el-col>
    <el-col span="10" style="position: relative;height: 100%;">
      <div class="title">Sold Items</div>
      <div v-for="item in soldItemList">
        <el-card   shadow="always" class="unsold-card">
          <el-row type="flex"
                  align="middle">
            <el-col span="6">  <span class="itemName">{{item.itemName}}</span></el-col>
            <el-col span="4"><span class="price">{{item.price}}</span></el-col>
            <el-col span="8">  <span class="time">{{item.date}}</span></el-col>
          </el-row>
        </el-card>
      </div>
      <div style="position:absolute;bottom:10px;left:30%">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-count="soldPageCount"
            v-bind:current-page.sync="currentSoldPage"
            v-on:current-change="loadSoldPage"
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
      soldPageCount:0,
      unsoldPageCount:0,
      currentSoldPage:1,
      currentUnsoldPage:1,
      soldItemList:[],
      unsoldItemList:[],
      userId:0,
    }
  },
  methods:{
    loadSoldPage(pageNum){
      this.axios.get(config.serverAdress1+":8079/sold-posts-by-id?pageNum="+pageNum+"&pageSize=8&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.soldItemList=resJSON.itemCardVOs;
            this.soldPageCount=resJSON.pageCount;
          }
      )
    },
    loadUnsoldPage(pageNum){
      this.axios.get(config.serverAdress1+":8079/unsold-posts-by-id?pageNum="+pageNum+"&pageSize=8&userId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.unsoldItemList=resJSON.itemCardVOs;
            this.unsoldPageCount=resJSON.pageCount;
            console.log("unsold page count"+this.unsoldPageCount)
          }
      )
    },
    markAsSold(postId){
      this.axios.get(config.serverAdress1+":8079/mark-as-sold?postId="+postId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            this.loadSoldPage(this.currentSoldPage);
            this.loadUnsoldPage(this.currentUnsoldPage);
          }
      )
    }
  },
  mounted(){    this.userId=JSON.parse(sessionStorage.getItem("userData")).userId;
    this.currentSoldPage=1;
    this.currentUnsoldPage=1;
    this.loadSoldPage(1);
    this.loadUnsoldPage(1);
    console.log("after mounted unsold page count is"+this.unsoldPageCount)
    console.log(typeof (this.unsoldPageCount))
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
.time {
  font-size: 14px;
  color:gray;
  margin-left: 5px;
}
.price {
  font-size: 16px;
  color:orangered;
  font-weight:bold;
  margin-left: 5px;
  margin-right: 10px;
}
.el-col {
  min-height: 1px
}
</style>