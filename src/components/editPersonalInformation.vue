<template>
  <div>
    <el-form ref="registerForm" :model="form" label-width="140px" class="login-box" v-bind:rules="rules">
      <h3 class="login-title">Edit Personal Information</h3>
      <el-form-item label="Username" prop="userName">
        <el-input v-model="form.userName" ></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" ></el-input>
      </el-form-item>
      <el-form-item label="Re-enter Password" prop="checkPass">
        <el-input v-model="form.checkPass"></el-input>
      </el-form-item>
      <el-form-item label="College/School" prop="collegeOrSchool">
        <el-select v-model="form.collegeOrSchool">
          <el-option v-for="(school,index) in schoolList"  v-bind:key= "index" v-bind:label="school" v-bind:value="school"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Avatar" >
        <el-upload
            class="avatar-uploader"
            v-bind:action="avatarUploadUrl"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG"
            :show-file-list="false"
            :http-request="uploadImg">
          <img v-if="imageUrl" v-bind:src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-button type="primary" v-on:click="submitForm('registerForm')">Confirm edition</el-button>
    </el-form>
  </div>
</template>
<script>
import config from "../static/config"
var schoolList=config.schoolList
export default {
  name: "Login",
  data() {
    var checkReEnteredPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('Please re-enter your password!'));
      } else if (value !== this.form.password) {
        callback(new Error('Does not match with the password you entered'));
      } else {
        callback();
      }
    };
    return {
      form:{
        userName:"",
        password:"",
        checkPass:"",
        collegeOrSchool:"",
      },
      rules: {
        userName: [
          {required: true, message: 'Username cannot be empty!', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Password cannot be empty!', trigger: 'blur'}
        ],
        checkPass: [
          {validator: checkReEnteredPass, trigger: 'blur'},
        ],
        collegeOrSchool: [
          {required: true, message: 'Please make a selection!', trigger: 'blur'}
        ]
      },
      imageUrl: '',
      schoolList,
      avatarUploadUrl: config.serverAdress1 + ":8079/uploadAvatar",
      userId:0,
    }
  },
  mounted() {
    console.log("mounted")
    this.userId=JSON.parse(sessionStorage.getItem("userData")).userId;
    this.axios.get(config.serverAdress1 + ":8079/query-user-by-id?userId="+this.userId).then(
        (res) => {
          console.log("res"+resJSON)
          var resJSON = JSON.parse(res.request.responseText);
          if (resJSON.message == 'success') {
            this.placeHolders=resJSON.data;
            this.imageUrl=resJSON.data.avatarUrl;
            this.form.userName=resJSON.data.userName;
            this.form.password=this.form.checkPass=resJSON.data.userPassword;
            this.form.collegeOrSchool=resJSON.data.collegeOrSchool;
          }
        }
    )
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.imageUrl !== '') {
          console.log({
            userId: this.userId,
            userName: this.form.userName,
            userPassword: this.form.password,
            collegeOrSchool: this.form.collegeOrSchool,
            avatarUrl: this.imageUrl
          })
          this.axios.post(config.serverAdress1 + ":8079/update-user", {
            userId: this.userId,
            userName: this.form.userName,
            userPassword: this.form.password,
            collegeOrSchool: this.form.collegeOrSchool,
            avatarUrl: this.imageUrl
          }).then((res) => {

            var resObject = JSON.parse(res.request.responseText);
            if (resObject.message == "success") {
              this.$message.success("Successfully updated personal information");
            };
          })
        } else {
          this.$message.error('Please complete the form');
          return false;
        }
      });
    },
    uploadImg: function (file) {
      if (this.fileList.length === 0) {
        this.$message.warning("Please upload at least one photo")
        const isLt2M = file.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('The image size should be less than 2MB!');
        } else {
          const params = new FormData()
          params.append('file', file.file);
          this.axios.post(config.serverAdress1 + ":8079/uploadAvatar", params).then(
              (res) => {
                var resJSON = JSON.parse(res.request.responseText);
                if (resJSON.result == 'success') {
                  this.imageUrl = resJSON.imgUrl;
                  this.$message.success("Successfully uploaded your avatar")
                } else {
                  this.$message.error(resJSON.message)
                }

              }
          )
        }
      }

    },
  }
}

</script>

<style scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 500px;
  margin: 50px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: #eeeeee;
  text-align: center;
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed gray;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}


</style>

