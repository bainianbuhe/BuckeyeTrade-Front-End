<template>
  <div>
    <el-button type="primary" style="margin: 10px" v-on:click="goBack">Go back</el-button>
    <div class="detail-box">
      <el-row>
        <el-col :span="12" >
          <el-carousel height="512px">
            <el-carousel-item  v-for="(imgUrl,index) in itemDetailVO.imgUrls" :key="imgUrl">
              <el-image :src="imgUrl" style="width: 424px;height:512px" :fit="fitMethod"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="12" >
          <h class="title">{{itemDetailVO.itemName}}</h>
          <div class="price">{{itemDetailVO.price}}</div>
          <div style="display: flex;align-items: center;margin-top:20px">
            <el-image class="author-avatar":src="itemDetailVO.authorAvatarUrl"  alt=""/>
            <span class="author-name">{{ itemDetailVO.authorName }}</span>
            <el-button v-if="isFollow" type="primary" v-on:click="unFollow">Unfollow</el-button>
            <el-button v-else-if="userId!=itemDetailVO.authorId" type="primary" v-on:click="follow">Follow</el-button>
          </div>
          <div style="margin-left: 50px;margin-top: 20px">
            <span class="author-name">Contact:</span>
            <span class="contact">
            {{itemDetailVO.contact}}
            </span>
          </div>
            <div style="margin-left: 50px;position: absolute;bottom: 20px">
              <span class="time">Posted at{{itemDetailVO.postTime}}</span>
            </div>
        </el-col>
      </el-row>
    </div>
    <div class="detail-box" >
      <div style="font-size: 30px;font-weight: bold">Description</div>
      <el-divider></el-divider>
      <div class="description">
        {{itemDetailVO.description}}
      </div>
    </div>
    <div class="detail-box">
      <div class="container">
        <div class="write-reply" @click="showCommentInput()">
          <i class="el-icon-edit"></i>
          <span class="add-comment">Write a comment</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showCommentInputFlag">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      maxlength="128"
                      show-word-limit
                      autofocus
                      placeholder="Write your comment here">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">Cancel</span>
              <el-button class="btn" type="success" round @click="commitComment">Confirm</el-button>
            </div>
          </div>
        </transition>
        <transition name="fade2">
          <div class="input-wrapper" v-if="showReplyInputFlag">
            <el-input class="gray-bg-input"
                      v-model="inputReply"
                      type="textarea"
                      :rows="3"
                      autofocus
                      maxlength="128"
                      show-word-limit
                      :placeholder="currentPlaceHolder">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancelReply">Cancel</span>
              <el-button class="btn" type="success" round @click="commitReply">Confirm</el-button>
            </div>
          </div>
        </transition>
        <div class="comment" v-for="item in comments">
          <div class="info">
            <img class="avatar" :src="item.fromAvatar" width="36" height="36"/>
            <div class="right">
              <div class="name">{{item.fromName}}</div>
              <div class="date">{{item.time}}</div>
            </div>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="control">
        <span class="comment-reply" @click="showReplyInput(item,item.commentId)">
          <i class="iconfont icon-comment"></i>
          <span>Reply</span>
        </span>
          </div>
          <div class="reply" >
            <div class="item" v-for="(reply,index) in item.reply">
              <div class="reply-content">
                <img class="avatar" :src="reply.fromAvatar" width="24" height="24" style="border-radius:50%;"/>
                <span class="from-name">{{reply.fromName}}</span><span>: </span>
                <span class="to-name">@{{reply.toName}}</span>
                <span>{{reply.content}}</span>
              </div>
              <span class="reply-bottom" >
            <span>{{reply.time}}</span>
            <div class="reply-text" @click="showReplyInput(reply,item.commentId)">
              <i class="iconfont icon-comment"></i>
              <span>Reply</span>
            </div>
            <div></div>
          </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comment from "@/components/comment";
import config from "@/static/config";
export default {
  name: "itemDetail",
  data(){
    return{
      itemDetailVO:{
        imgUrls:[],
        authorAvatarUrl:"",
        authorName:"",
        contact:"",
        description:"",
        tag:"",
        itemName:"",
        price:"",
        postTime:"",
        authorId:0,
      },
      fitMethod:"fill",
      comments:{},
      postId:0,
      userId:0,
      inputComment: '',
      showItemId: '',
      showCommentInputFlag:false,
      inputReply:'',
      showReplyInputFlag:false,
      currentFocusedToId:0,
      currentPlaceHolder:"",
      currentFocusedOwnerId:0,
      isFollow:false,
    }
  },
  mounted() {
    var userData=JSON.parse(sessionStorage.getItem("userData"))
    this.userId=userData.userId;
    const postId= this.$route.params.postId;
    this.postId=postId;
    console.log("postID"+postId);
    console.log("this.postID"+this.postId);
    console.log(config.serverAdress1+":8079/get-item-detail-VO?postId="+postId)
    this.refreshComments();
    this.axios.get(config.serverAdress1+":8079/get-item-detail-VO?postId="+postId).then(
        (res)=>{
          const resJSON=JSON.parse(res.request.responseText);
          console.log(resJSON);
          this.itemDetailVO=resJSON.itemDetailVO;
          this.axios.get(config.serverAdress1+":8079/follow-flag?followerId="+this.userId+"&followedUserId="+this.itemDetailVO.authorId).then((res)=> {
            const resJSON=JSON.parse(res.request.responseText);
            console.log("is Follow"+resJSON)
            console.log(typeof(resJSON))
            this.isFollow=resJSON;
          });
        }
    )
    this.axios.get(config.serverAdress1+":8079/get-comment-board?postId="+this.postId).then((res)=> {
      const resJSON=JSON.parse(res.request.responseText);
      if(resJSON.message=='success'){
        this.inputComments=resJSON.data;
      }
      else{
        this.$message.error("Failed to get comment data");
      }
    });

  },
  components:{
    comment,
  },
  methods:{
    follow(){
      this.axios.get(config.serverAdress1+":8079/follow?followedUserId="+this.itemDetailVO.authorId+"&followerId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            console.log(resJSON)
            if(resJSON.message=="success"){
              this.$message.success("Successfully followed "+this.itemDetailVO.authorName);
              this.isFollow=true;
            }
          }
      )
    },
    unFollow(){
      this.axios.get(config.serverAdress1+":8079/un-follow?followedUserId="+this.itemDetailVO.authorId+"&followerId="+this.userId).then(
          (res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            console.log(resJSON)
            if(resJSON.message=="success"){
              this.$message.success("Successfully unfollowed "+this.itemDetailVO.authorName);
              this.isFollow=false;
            }
          }
      )
    },
    goBack(){
      this.$router.back(-1)
    },
    cancel() {
      this.showCommentInputFlag=false;
      this.inputComment='';
    },

    /**
     * 提交评论
     */
    commitComment() {
      if(this.inputComment.length==0){
        this.$message.error("The length of the comment should be larger than 0")
      }
      else{
        const commentDTO={
          fromId:this.userId,
          content:this.inputComment,
          ownerId:this.postId,
        };
        console.log(this.inputComment);
        console.log("postid in comment"+this.postId);
        const params=new FormData();
        params.append("commentDTO",commentDTO);
        this.axios.post(config.serverAdress1+":8079/insert-comment",commentDTO).then((res)=> {
          const resJSON=JSON.parse(res.request.responseText);
          if(resJSON.message=='success'){
            this.$message.success("Comment uploaded successfully");
            this.refreshComments();
          }
        });
        this.showCommentInputFlag=false;
        this.inputComment='';
        //TODO refresh itemList
      }
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput() {
      this.showCommentInputFlag=true;
      this.showReplyInputFlag=false;
    },

    showReplyInput(item,ownerId){
      this.showReplyInputFlag=true;
      this.showCommentInputFlag=false;
      this.currentFocusedOwnerId=ownerId;
      //actually it's to_id here now
      const fromId=item.fromId;
      this.currentFocusedToId=fromId;
      this.currentPlaceHolder="Write your reply to "+item.fromName+" here";
    },
    cancelReply(){
      this.showReplyInputFlag=false;
      this.inputReply='';
    },
    commitReply(){
      if(this.inputReply.length==0){
        this.$message.error("The length of the reply should be larger than 0")
      }
      else{
        const replyDTO={
          fromId:this.userId,
          toId:this.currentFocusedToId,
          ownerId:this.currentFocusedOwnerId,
          content:this.inputReply,
        }
        console.log(replyDTO);
        this.axios.post(config.serverAdress1+":8079/insert-reply",replyDTO).then((res)=>{
          const resJSON=JSON.parse(res.request.responseText);
          if(resJSON.message=='success'){
            this.$message.success("Reply uploaded successfully");
            this.refreshComments();
          }
        })
        this.showReplyInputFlag=false;
        this.inputReply=''
      }

    },
    refreshComments(){
      console.log("refreshed");
      this.axios.get(config.serverAdress1+":8079/get-comment-board?postId="+this.postId).then((res)=> {
        const resJSON=JSON.parse(res.request.responseText);
        if(resJSON.message=='success'){
          this.comments=resJSON.data;
          console.log("data"+resJSON.data);
        }
        else{
          this.$message.error("Failed to get comment data");
        }
      });
    },

  }
}
</script>

<style scoped lang="scss">
.detail-box {
  border: 1px solid #DCDFE6;
  width: 45%;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: #eeeeee;
  margin:20px auto;
}

.title{
  font-size:30px;
  font-weight:300;
  margin-left: 50px;
}

.price{
  font-size:25px;
  font-weight:bold;
  color:orangered;
  margin-left: 50px;
  margin-top: 20px;
}

html,body,#app{
  padding: 0px;
  margin: 0px;
  height: 100%;
}
.author-avatar{
  width: 48px;
  height: 48px;
  border: 1px solid #eee;
  border-radius: 50%;
  margin-left: 50px;
}
.author-name{
  font-size:25px;
  font-weight:300;
  text-align: center;
}
.contact{
  font-size:25px;
  text-align: center;
}
.time {
  font-size: 20px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  color:gray;
}
.description{
  font-size: 20px;
}
@import "../../public/scss/index";
.input-wrapper {
  padding: 10px;
.gray-bg-input, .el-input__inner {
  /*background-color: #67C23A;*/
}
.btn-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
.cancel {
  font-size: 16px;
  color: $text-normal;
  margin-right: 20px;
  cursor: pointer;
&:hover {
   color: $text-333;
 }
}
.confirm {
  font-size: 16px;
}
}
}
.write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
  padding: 10px;
  cursor: pointer;
&:hover {
   color: $text-main;
 }
.el-icon-edit {
  margin-right: 5px;
}
}
.container {
  padding: 0 10px;
  box-sizing: border-box;
.comment {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid $border-fourth;
.info {
  display: flex;
  align-items: center;
.avatar {
  border-radius: 50%;
}
.right {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
.name {
  font-size: 16px;
  color: $text-main;
  margin-bottom: 5px;
  font-weight: 500;
}
.date {
  font-size: 12px;
  color: $text-minor;
}
}
}
.content {
  font-size: 16px;
  color: $text-main;
  line-height: 20px;
  padding: 10px 0;
}
.control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
.like {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
&.active, &:hover {
             color: $color-main;
           }
.iconfont {
  font-size: 14px;
  margin-right: 5px;
}
}
.comment-reply {
  display: flex;
  align-items: center;
  cursor: pointer;
&:hover {
   color: $text-333;
 }
.iconfont {
  font-size: 16px;
  margin-right: 5px;
}
}

}
.reply {
  margin: 10px 0;
  border-left: 2px solid $border-first;
.item {
  margin: 0 10px;
  padding: 10px 0;
  border-bottom: 1px dashed $border-third;
.reply-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-main;
.from-name {
  color: $color-main;
}
.to-name {
  color: $color-main;
  margin-left: 5px;
  margin-right: 5px;
}
}
.reply-bottom {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: $text-minor;
.reply-text {
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
&:hover {
   color: $text-333;
 }
.icon-comment {
  margin-right: 5px;
}
}
}
}
.write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
  padding: 10px;
  cursor: pointer;
&:hover {
   color: $text-main;
 }
.el-icon-edit {
  margin-right: 5px;
}
}
.fade-enter-active, fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.input-wrapper {
  padding: 10px;
.gray-bg-input, .el-input__inner {
  /*background-color: #67C23A;*/
}
.btn-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
.cancel {
  font-size: 16px;
  color: $text-normal;
  margin-right: 20px;
  cursor: pointer;
&:hover {
   color: $text-333;
 }
}
.confirm {
  font-size: 16px;
}
}
}
}
}
}
</style>