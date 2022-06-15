<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              class="vcenter"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="4" :offset="1">
                <el-tag 
                  closable
                  @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 > 0 ? 'bdtop' : '', 'vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag 
                    type="success"
                    closable
                      @close="removeRightById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="email">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="deleteUserInfo(scope.row.id)"
              >删除</el-button
            >
            <!-- 设置角色按钮 -->
            <el-button icon="el-icon-setting" type="warning" size="mini"
              @click="showSetRightDialog(scope.row)">分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 增加角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
    >
      <el-form> 
        <el-tree :data="rightList" :props="treeProps" show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"></el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import { FormItem } from 'element-ui';
export default {
  data() {
    return {
      rightList:[],
      rolesList: [],
      addRoleDialog: false,
      setRightDialogVisible:false,
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      defKeys:[],
      roleId: '',
    };
  },
  methods: {
    // 分配权限
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys);
      const keysStr=keys.join(',');
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
      if(res.meta.status!==200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible=false
    },
    // 通过递归的形势获取三级菜单下的全部权限
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    async showSetRightDialog(role){
      this.roleId=role.id
      const{data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200)
        return this.$message.error('获取权限数据失败')
      this.rightList=res.data
      this.defKeys=[]
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible=true
    },
    // 根据id删除权限
    async removeRightById(role,rightId) {
      const removeConfirm=await this.$confirm("此操作将永久删除改权限,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err=>err);
      if(removeConfirm=="confirm"){
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !==200) 
          return this.$message.err('删除权限失败')
        this.$message.success('删除权限成功')
        role.children=res.data;

      }
    },
    closeAddRoleForm() {},
    addRole() {},
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
