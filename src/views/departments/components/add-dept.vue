<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="deptFrom" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width: 80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width: 80%;" type="textarea" placeholder="1-300个字符" :row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnok">确认</el-button>

      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data () {
    const validateName = async(rule, value, callback) => {
      // 获取最新组织架构
      var isRepeat = false
      const { depts } = await getDepartments()
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(key => key.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const validateCode = async(rule, value, callback) => {
      // 获取最新组织架构
      var isRepeat = false
      const { depts } = await getDepartments()
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }, peoples: [], // 简单员工列表
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: { showTitle() {
    return this.formData.id ? '编辑部门' : '新增子部门'
  } },

  methods: {
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      console.log(this.peoples)
    },
    btnok() {
      this.$refs.deptFrom.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          // this.$message.success('添加部门成功')
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      this.$refs.deptFrom.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$emit('update:showDialog', false)
    },
    // 获取部门详情
    async  getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }

}

</script>
<style lang='scss' scoped>
</style>
