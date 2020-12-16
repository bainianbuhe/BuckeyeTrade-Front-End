<template>
  <div>
  <div class="section-list" >
    <div class="card-list">
      <div v-for="list in dataList" @click="jumpToItemPage(list)"  class="card-item" >
        <div class="cover"  >
          <el-image :src="list.imgUrl" alt="" v-loading="loading"/>
        </div>
        <div class="info">
          <el-image :src="list.authorAvatarUrl"  alt=""/>
          <span>{{ list.authorName }}</span>
        </div>
        <div class="desc">
          <h class="price">{{list.price}}</h>
          <p>{{ list.itemName }}</p>
          <span class="time">{{list.date}}</span>
          <span class="tag">{{ list.label }}</span>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
export default {
name: "ItemsList",
  props:{
    dataList:Array
  },
  methods:{
  jumpToItemPage:function(list){
    this.$router.push({path:"/item-detail/"+list.postId})
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.section-list{
  text-align: center;
}
body, html {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  font: 14px/1.5 Helvetica,Tahoma,Arial,Hiragino Sans GB,Microsoft YaHei,SimSun,Heiti,sans-serif
}
#app {
  height: 100%;
  display: flex;
  align-items: center;
}
.container {
  width: 1240px;
  margin: 0 auto;
}
.section-list h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 400;
  font-style: normal;
}
.card-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left:10% ;
  margin-right:10%;
}
.card-item {
  width: 304px;
  height: 388px;
  background: #fff;
  transition: all .3s ease;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}
.card-item:hover {
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
.card-item .cover .el-image  {
  width: 304px;
  height: 220px;
}
.card-item .info {
  display: flex;
  align-items: center;
  padding: 10px;
}
.card-item .info .el-image {
  width: 36px;
  height: 36px;
  border: 1px solid #eee;
  border-radius: 50%;
  margin-right: 10px;
}
.card-item .desc {
  padding: 10px 15px 15px;
}
.card-item .desc p {
  font-size: 16px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  margin-bottom: 10px;

}
.time {
  font-size: 14px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  color:gray;
}
.price {
  font-size: 16px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  color:orangered;
  font-weight:bold;
  margin-bottom: 10px;
}

.tag{
  font-size: 14px;
  color:#409EFF;
  border:1px solid #409EFF;
  padding-left:10px;
  padding-right:10px;
  border-radius:25px;
  float:right;
}
</style>