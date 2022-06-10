<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, messege: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, messege: "长度在3-10个字符", trigger: "blur" },
        ],
        //验证密码是否合法
        password: [
          { required: true, messege: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, messege: "长度在6-15个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    //登录操作
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) {
          console.log("登录失败");
          console.log(this);
          return this.$message({
            showClose: true,
            message: "登陆失败,请填写正确的用户名密码",
            type: "error",
          });
        }
        this.$message({
          showClose: true,
          message: "登陆成功",
          type: "success",
        });
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push("/home")
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  width: 100%;
  padding: 20px;
  bottom: 0;
  box-sizing: border-box;
}
</style>
