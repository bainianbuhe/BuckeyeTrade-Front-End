<template>
  <div class="back-ground-image" >
    <img src="../assets/logo.jpg" height="90" width="300">
    <div class="login-box">
  <el-form ref="loginForm" :model="form" label-width="140px"  v-bind:rules="rules">
    <h3 class="login-title">Welcome!</h3>
    <el-form-item label="Username" prop="userName">
      <el-input v-model="form.userName"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-button type="primary" v-on:click="submitForm('loginForm')">Login</el-button>
  </el-form>
    <p >New user?</p>
    <el-button type="primary" v-on:click="jumpToRegister">Create your account</el-button>
    </div>
  </div>
</template>
<script>
import config from "../static/config"
var form={
  userName:"",
  password:"",
}

export default {
name: "Login",
  data(){
  return {
    form:form,
    rules: {
      userName: [
        {required: true, message: 'Username cannot be empty!', trigger: 'blur'}
      ],
      password: [
        {required: true, message: 'Password cannot be empty!', trigger: 'blur'}
      ],
    }
  }
  },
  methods:{
    jumpToRegister:function(){
      this.$router.push({name:"Register"})
    },
  submitForm(formName) {
    this.$refs[formName].validate((valid) => {
      if (valid) {
        this.axios.get(config.serverAdress1+":8079/login?"+"userName="+form.userName+"&password="+form.password).then(
            (res)=>{
              var resObject=JSON.parse(res.request.responseText);
              if(resObject.result=="success"){
                sessionStorage.setItem("userData",JSON.stringify(resObject.data));
                console.log(resObject.data)
                console.log(sessionStorage.getItem("userData"))
                this.$message.success("Login success");
                this.$router.push({name:"MainPage"})
              }
              else if(resObject.result=="failure"){
                this.$message.error(resObject.message);
              }
            }
        )
      } else {
        this.$message.error('Please complete the form');
      }
    });
  },
  },
  mounted() {

    this.form.userName="";
    this.form.password="";
  },
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

</style>

