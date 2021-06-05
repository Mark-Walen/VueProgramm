<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <!-- 搜索添加区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable
                  @clear="getUserList">
          <template #append>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户列表区域 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <!-- slot-scope自 2.6.0 起被废弃 -->
        <template v-slot:default="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#dcdfe6"
                     @change="userStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px">
        <template v-slot:default="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini"
                     @click="showEditDialog(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" circle size="mini"
                     @click="removeUserById(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <!--添加用户对话框 -->
  <el-dialog
    title="添加用户"
    v-model="addDialogVisible"
    width="50%"
    @close="addDialogClosed">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <!-- 底部按钮区域 -->
      <span class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </template>
  </el-dialog>

  <!--修改用户对话框 -->
  <el-dialog
    title="修改用户"
    v-model="editDialogVisible"
    width="50%"
    @close="editDialogClosed">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Users.vue",
  data() {
    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '密码的长度在6~15个字符之间',
          trigger: 'blur'
        }],
        // TODO 使用正则表达式校验邮箱
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "邮箱地址格式不正确",
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        }, {
          pattern: /^1\d{10}$/,
          message: "手机号码格式不正确",
          trigger: 'blur'
        }]
      },
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      //
      editFormRules: [{
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "邮箱地址格式不正确",
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入电话号码',
          trigger: 'blur'
        }, {
          pattern: /^1\d{10}$/,
          message: "手机号码格式不正确",
          trigger: 'blur'
        }]
      }]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.code !== 200) return this.$message.error("获取用户列表失败")
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 监听 pageSize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userInfo) {
      const {data: res} = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.code !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
    },

    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.code !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        await this.getUserList()
      })
    },
    // 展示修改用户对话框
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.code !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听添加用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.put('/users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.code !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 隐藏修改用户对话框
        this.editDialogVisible = false
        await this.getUserList()
      })
    },
    // 根据用户id删除对应的用户信息
    async removeUserById(id) {
      // 打开删除用户弹窗
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('/users/' + id)
      if (res.meta.code !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      await this.getUserList()
    },
  }
}
</script>
<style Lang="less" scoped>
</style>
