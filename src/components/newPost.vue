<template>
  <el-form ref="newPostForm" :model="newPostForm" label-width="200px" class="login-box" v-bind:rules="rules">
    <h3 class="login-title">Item Information</h3>
    <el-form-item label="Item Name" prop="itemName">
      <el-input
          type="text"
          v-model="newPostForm.itemName"
          maxlength="64"
          show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="Price($)" prop="price">
      <el-input
          type="text"
          v-model="newPostForm.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="Tag" prop="tag">
      <el-select v-model="newPostForm.tag" placeholder="Please make a selection">
        <el-option
            v-for="(tag,index) in tagOptions"
            :key="index"
            :label="tag"
            :value="tag">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Description" prop="description">
      <el-input
          type="textarea"
          :rows="5"
          placeholder="Enter description here"
          v-model="newPostForm.description">
      </el-input>
    </el-form-item>
    <el-form-item label="Item images" >
    <el-upload
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
        :file-list="fileList"
        :on-change="handleChange"
        :auto-upload="true"
        list-type="picture"
        :http-request="addNewPic"
        :limit="4"
        :on-exceed="handleExceed"
        :show-file-list="true">
      <el-button type="primary">Add another photo</el-button>
      <div slot="tip" class="el-upload__tip">Please upload 1-4 photos, accepts jpg/jpeg/png, size should be less than 500kb</div>
    </el-upload>
      <el-button type="primary" v-on:click="uploadFiles">Upload</el-button>
    </el-form-item>
    <el-form-item label="contact" prop="contact">
      <el-input
          type="text"
          v-model="newPostForm.contact"
          maxlength="64"
          show-word-limit></el-input>
    </el-form-item>
    <el-button type="primary" v-on:click="submitForm('newPostForm')">Submit</el-button>
  </el-form>
</template>
<script>
import config from "@/static/config";
export default {
  name: "newPost",
  data:function(){
    return {
      tagOptions:["Electronic","Daily Use","Books","Sports","Tickets","Others"],
      newPostForm:{
        itemName:"",
        description:"",
        contact:"",
        folderUrl:"",
        imgNames:"",
        tag:"",
        authorId:0,
        price:0,
      },
      rules: {
        itemName: [
          {required: true, message: 'Item name cannot be empty!', trigger: 'blur'}
        ],
        description:[
          {required: true, message: 'Item description cannot be empty!', trigger: 'blur'}
        ],
        contact:[
          {required: true, message: 'Contact cannot be empty!', trigger: 'blur'}
        ],
        tag:[
          {required: true, message: 'Contact cannot be empty!', trigger: 'blur'}
        ],
        price:[
          {required: true, message: 'Please enter a price with a correct format(Up to two decimal places are permitted)!', trigger: 'blur',pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/}
        ],

      },
      fileList:[],
      files:[],
      config:config,
    }
  }
  ,methods:{
    submitForm(formName) {
      console.log("names"+this.newPostForm.imgNames)
      this.newPostForm.authorId=JSON.parse(sessionStorage.getItem("userData")).userId;
      this.$refs[formName].validate((valid)=>{
        if(valid&&this.newPostForm.folderUrl!=""){
          this.axios.post(this.config.serverAdress1+":8079/new-post",this.newPostForm).then((res)=>{
            const resJSON=JSON.parse(res.request.responseText);
            if(resJSON.message=="success"){
              this.$message.success("Post created");
              this.$router.push("/profile/my-posts")
            }
            else{
              this.$message.error("Please try again");
            }
          })
        }
        else if(this.newPostForm.folderUrl==""){
          this.$message.error("Please upload at least one photo before creating the new post!")
        }
        else if(!valid){
          this.$message.error("Please complete the form!")
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      for(let index=0;index<this.files.length;index++){
        if(this.files[index].name==file.name){
          this.files.splice(index,1);
        }
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file,fileList){
      this.fileList.push({
        name:file.name,
        url:URL.createObjectURL(file.raw)
      })
      console.log(this.fileList);
    },
    uploadFiles(){
      console.log(this.files)
      for(  let index=0;index<this.files.length;index++){
        console.log("size"+this.files[index].size/1024/1024)
      }
      if (this.fileList.length === 0) {
        this.$message.error("Please upload at least one photo");}
        else{
        let isLt2M=true;
        for(  let index=0;index<this.files.length;index++){
          isLt2M = this.files[index].size / 1024 / 1024 < 2&&isLt2M;
        }
        if (!isLt2M) {
          this.$message.error('Each of the photo should be smaller than 2MB, please remove the illegal photos');
        }else{
          const params=new FormData();
          for(let i=0;i<this.files.length;i++){
            params.append("files",this.files[i]);
          }
          params.append("id",JSON.parse(sessionStorage.getItem("userData")).userId);
          this.axios.post(this.config.serverAdress1+":8079/upload/post-photos",params).then((res)=>{
            console.log(res);
            const resJson=JSON.parse(res.request.responseText);
            if(resJson.result=="success"){
              this.$message.success("Photos uploaded successfully");
              this.newPostForm.folderUrl=resJson.folderUrl;
              this.newPostForm.imgNames=resJson.imgNames;
            }
            else{
              this.$message.error(resJson.message);
            }
          })
        }
      }

    },
    handleExceed(files, fileList) {
      this.$message.warning(`Limit for the number of photos is 4`);
    },
    addNewPic(file){
      this.files.push(file.file);
    },
  }
}
</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 700px;
  margin: 50px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: #f4f4f4;
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>