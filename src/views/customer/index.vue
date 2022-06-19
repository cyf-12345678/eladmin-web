<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">客户姓名</label>
        <el-input v-model="query.name" clearable placeholder="客户姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">联系电话</label>
        <el-input v-model="query.userPhone" clearable placeholder="联系电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="id">
                <el-input v-model="form.id" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户姓名">
                <el-input v-model="form.name" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.userPhone" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码">
                <el-input v-model="form.userCertifcode" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="租车时长">
                <el-input v-model="form.carRentalTime" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租车开始时间">
                <el-date-picker v-model="form.carRentalStart" type="datetime" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="租车结束时间">
                <el-date-picker v-model="form.carRentalEnd" type="datetime" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人" prop="createUser">
                <el-input v-model="form.createUser" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="form.createTime" type="datetime" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="更新人" prop="updateUser">
            <el-input v-model="form.updateUser" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updateTime">
            <el-date-picker v-model="form.updateTime" type="datetime" style="width: 100%;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="客户姓名" />
        <el-table-column prop="userPhone" label="联系电话" />
        <el-table-column prop="userCertifcode" label="证件号码" />
        <!--        <el-table-column prop="createUser" label="创建人" />-->
        <!--        <el-table-column prop="createTime" label="创建时间" />-->
        <!--        <el-table-column prop="updateUser" label="更新人" />-->
        <!--        <el-table-column prop="updateTime" label="更新时间" />-->
        <el-table-column prop="carRentalTime" label="租车时长" />
        <el-table-column prop="carRentalStart" label="租车开始时间" />
        <el-table-column prop="carRentalEnd" label="租车结束时间" />
        <el-table-column v-if="checkPer(['admin','customerInfo:edit','customerInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudCustomerInfo from '@/api/customerInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, userPhone: null, userCertifcode: null, createUser: null, createTime: null, updateUser: null, updateTime: null, carRentalTime: null, carRentalStart: null, carRentalEnd: null }
export default {
  name: 'CustomerInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '客户管理接口', url: 'api/customerInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCustomerInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'customerInfo:add'],
        edit: ['admin', 'customerInfo:edit'],
        del: ['admin', 'customerInfo:del']
      },
      rules: {
        createUser: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateUser: [
          { required: true, message: '更新人不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '客户姓名' },
        { key: 'userPhone', display_name: '联系电话' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
