<template>
  <div v-loading="loading" class="tree-card">

    <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
    <el-tree :data="departs" :props="defaultProps" default-expand-all>
      <treeTools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @update="updateDepts" />
    </el-tree>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
import addDept from '@/views/departments/components/add-dept.vue'

export default {

  components: { TreeTools, addDept },

  data () {
    return {
      defaultProps: {
        label: 'name'
      },
      company: {}, // 公司
      departs: [], // tree
      showDialog: false,
      node: {}, // 当前点击时的部门
      loading: false
    }
  },

  computed: {},
  created() {
    this.getDepartments()
  },

  methods: {
    async  getDepartments() {
      this.loading = true
      const result = await getDepartments()

      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = transListToTreeData(result.depts, '')
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    async updateDepts(node) {
      this.node = node
      await this.$refs.addDept.getDepartDetail(node.id)
      this.showDialog = true
    }
  }

}

</script>
<style  scoped>
  .tree-card{
    padding: 30px 140px;
    font-size: 14px;
  }
</style>
