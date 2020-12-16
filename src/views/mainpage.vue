<template xmlns:itemlist="http://www.w3.org/1999/html">
  <div class="homeBox ">
    <el-container>
   <el-header>
     <el-row class="navi-manu-horizontal"
             type="flex"
             align="middle">
       <el-col span="2">
         <img src="../assets/logo.jpg" width="200" height="60"/>
       </el-col>
       <el-col span="3" offset="8">
         <el-form ref="form" >
           <el-input v-model="keyword" placeholder="Type what you need here">
           </el-input>
         </el-form>
       </el-col>
       <el-col span="1">
         <el-button type="primary" icon="el-icon-search" v-on:click="searchFunc"></el-button>
       </el-col>
       <el-col span="6"/>
      <el-col span="2">
        <el-button type="primary" v-on:click="jumpToMyPosts">My posts</el-button>
      </el-col>
       <el-col span="1">
         <el-button type="primary" v-on:click="jumpToNewPost">Sell</el-button>
       </el-col>
       <el-col span="1">
         <el-dropdown >
           <span class="el-dropdown-link"><el-avatar  v-bind:src="userData.avatarUrl" fit="fill"></el-avatar></span >
              <el-dropdown-menu slot="dropdown">
    <el-dropdown-item command="logOut" @click.native="logOut">Log out</el-dropdown-item>
    <el-dropdown-item command="jumpToProfile" @click.native="jumpToProfile">Your account</el-dropdown-item>
  </el-dropdown-menu>
         </el-dropdown>
       </el-col>
       <el-col span="1">
        <el-button  icon="el-icon-message" circle v-on:click="$router.push('/profile/message')"></el-button>
       </el-col>
     </el-row>
   </el-header>
      <el-container  style=" display: flex;
    align-items: center;">
        <el-aside width="15%"
                  class="el-aside" style=" display: flex;
    align-items: center;">
              <el-menu
              default-active="1"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              @select="handleSelect"
          style="  padding: 30px">
            <el-menu-item index="1">
              <i class="el-icon-s-marketing"></i>
              <span slot="title">Recent posts</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-headset"></i>
              <span slot="title">Electronic</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-toilet-paper"></i>
              <span slot="title">Daily Use</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">Books</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-basketball"></i>
              <span slot="title">Sports</span>
            </el-menu-item>
            <el-menu-item index="6">
              <i class="el-icon-tickets"></i>
              <span slot="title">Tikets</span>
            </el-menu-item>
            <el-menu-item index="7">
              <i class="el-icon-more-outline"></i>
              <span slot="title">Others</span>
            </el-menu-item>
                <el-menu-item index="8">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title">From My Following</span>
                </el-menu-item>

          </el-menu>
        </el-aside>
        <el-container >
          <el-main  style="text-align: center">
            <itemlist v-bind:dataList="dataList" style="height: 95%"></itemlist>
            <el-pagination
                background
                layout="prev, pager, next"
                :page-count="pageCount"
                :current-page.sync="currentPage"
            v-on:current-change="loadPage"
               >
            </el-pagination>
          </el-main>
        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import itemlist from "@/components/itemlist";
import config from "@/static/config";
var search="";
var dataList=[]
export default {
name: "MainPage",
  components: { itemlist},
  data:function (){
  return {
    search,
    dataList,
    userData:{},
    pageCount:0,
    currentTag:"Recent posts",
    currentPage:1,
    keyword:'',
  }
  },
  methods:{
  loadPage(pageNum){
    this.axios.get(config.serverAdress1+":8079/get-item-vos?tag="+this.currentTag+"&pageNum="+pageNum+"&pageSize=8&userId="+this.userData.userId).then(
        (res)=>{
          const resJSON=JSON.parse(res.request.responseText);
          this.dataList=resJSON.itemCardVOs;
          console.log(pageNum)
          this.pageCount=resJSON.pageCount
        }
    )
  },
    jumpToRegsiter:function(){
      this.$router.push({name:"Profile"});
    },
    handleSelect(index,indexPath){
    const tagList=["Recent posts","Electronic","Daily Use","Books","Sports","Tickets","Others","following"];
    this.currentTag=tagList[index-1];
      console.log(this.currentTag)
    this.currentPage=1;
    this.loadPage(1)
      console.log(this.dataList)
    },
    jumpToNewPost(){
      this.$router.push({path:"profile/new-post"});
    },
    searchFunc(){
    console.log(this.keyword)
      this.axios.get(config.serverAdress1+":8079/search-by-keyword?tag="+this.currentTag+"&pageNum="+this.currentPage+"&pageSize=8"+"&keyword="+this.keyword+"&userId="+this.userData.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            if(resJSON.itemCardVOs.length==0){
              this.$notify.error({
                title: 'No result',
                message: 'No matches found'
              });
            }else{
              this.dataList=resJSON.itemCardVOs;
              this.pageCount=resJSON.pageCount;
            }
          }
      )
    },
    logOut(){
    sessionStorage.clear();
    this.$router.push("/login")
    },
    jumpToMyPosts(){
    this.$router.push("/profile/my-posts")
    },
    jumpToProfile(){
      this.$router.push("/profile/message")
    }
  },
  mounted:function(){
    this.userData=JSON.parse(sessionStorage.getItem("userData"))
    this.axios.get(config.serverAdress1+":8079/get-item-vos?tag=Recent posts&pageNum=1&pageSize=8&userId="+this.userData.userId).then(
        (res)=>{
          const resJSON=JSON.parse(res.request.responseText);
          this.dataList=resJSON.itemCardVOs;
          console.log(resJSON)
          this.pageCount=resJSON.pageCount
        }
    )
  },

  }

</script>
<style scoped>
.homeBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.navi-manu-horizontal{
  background-color: #545c64;
}

.el-aside {
  height:100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
html,body,#app,.el-container{
  padding: 0px;
  margin: 0px;
  height: 100%;
}
</style>