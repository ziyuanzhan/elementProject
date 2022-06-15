<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <!-- 左侧图标文字 -->
      <div>
        <img src="../assets/heima.png" alt="" @click="goHome"/>
        <span>电商后台管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <!-- 侧边导航栏 -->
    <el-container>
      <el-aside :width="isCollapse?'64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <el-submenu  v-for="item in menuList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="subItem in item.children" :key="subItem.id"  :index="'/'+subItem.path" @click="saveNavState(subItem.path)">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  methods: {
    quit() {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("activePath");
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res}=await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.menuList=res.data
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath','/'+activePath)
    },
    goHome(){
      if(this.$route.path=='/home'||this.$route.path=='/welcome')return 
      this.$router.push('/home')
      window.sessionStorage.removeItem('activePath')
      this.activePath=''
  }
  },
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
    this.activePath=this.activePath
  }
  
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
  overflow: scroll;
  height: calc(100vh - 60px);
}
.home-container {
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
