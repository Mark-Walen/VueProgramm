<template>
  <!--头部 -->
  <el-header>
    <div>
      <img src="../assets/icon-logo2.png" alt="logo">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </el-header>
  <!--页面主体区域 -->
  <el-container class="home-container">
    <!--侧边栏 -->
    <el-aside :width="isCollapsed?'fit-content' : '200px'">
      <div class="toggle-button" @click="toggleCollapse()">|</div>
      <el-menu :default-active="$route.path" router unique-opened :collapse="isCollapsed" background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse-transition="false">
        <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
          <template #title>
            <i class="iconfont" :class="'icon-' + item.class"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>el</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!--头部 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      isCollapsed: false
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.code !== 200) return this.$message.error(res.message)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style Lang="less" scoped>
/* header样式开始 */
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 16px;
}

.el-header > div {
  display: flex;
  align-items: center;
}

.el-header > div > img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}

.el-header > div > span {
  color: white;
  font-size: 20px;
  margin-left: 1em;
}

/* header样式结束*/

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #333744;
  transition: all ease-in-out .2s;
}

.el-menu {
  border-right: none;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  cursor: pointer;
}
.toggle-button,
.toggle-button::before,
.toggle-button::after {
  content: '|';
  font-size: 16px;
  line-height: 1.5em;
  letter-spacing: 0.1em;
}

.el-main {
  background-color: #eaedf1;
}
</style>
