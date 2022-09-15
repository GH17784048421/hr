<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span></el-col>
    <el-col :span="5">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown trigger="click" @command="handleCommand">
            <span>操作<i class="el-icon-arrow-down" /></span>
            <el-dropdown-menu slot="dropdown">

              <el-dropdown-item command="add"> 添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="update"> 编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete"> 删除部门</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {

  components: {},

  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }},
  data () {
    return {

    }
  },
  computed: {},

  methods: {
    handleCommand(type) {
      if (type === 'delete') {
        this.$confirm('确定要删除部门吗').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      } else if (type === 'update') {
        this.$emit('update', this.treeNode)
      } else {
        this.$emit('addDepts', this.treeNode)
      }
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
