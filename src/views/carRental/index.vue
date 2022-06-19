<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">车辆类型</label>
        <el-select v-model="query.carType" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.car_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!--        <el-input v-model="query.carType" clearable placeholder="车辆类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <label class="el-form-item-label">车辆品牌</label>
        <!--        <el-input v-model="query.carBrand" clearable placeholder="车辆品牌" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <el-select v-model="query.carBrand" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.car_brand"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="客户" prop="customerId">
            <el-select v-model="form.customerId" filterable placeholder="请选择" style="width: 370px">
              <el-option
                v-for="(item, index) in customerIds"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租用车辆" prop="id">
            <el-select v-model="form.id" filterable placeholder="请选择" style="width: 370px">
              <el-option
                v-for="(item, index) in ids"
                :key="index"
                :label="item.carCode"
                :value="item.id"
              />
            </el-select>
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
        <el-table-column prop="carType" label="车辆类型">
          <template slot-scope="scope">
            {{ dict.label.car_type[scope.row.carType] }}
          </template>
        </el-table-column>
        <el-table-column prop="carBrand" label="车辆品牌">
          <template slot-scope="scope">
            {{ dict.label.car_brand[scope.row.carBrand] }}
          </template>
        </el-table-column>
        <el-table-column prop="carCode" label="车牌号" />
        <el-table-column prop="carRentalFee" label="每小时租车费" />
        <el-table-column prop="carDeposit" label="押金" />
        <el-table-column prop="isDamaged" label="是否损坏">
          <template slot-scope="scope">
            {{ dict.label.is_damaged[scope.row.isDamaged] }}
          </template>
        </el-table-column>
        <el-table-column prop="carCompensate" label="损坏赔偿" />
        <el-table-column v-if="checkPer(['admin','carRentalInfo:edit','carRentalInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudCarRentalInfo from '@/api/carRentalInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, customerId: null }
export default {
  name: 'CarRentalInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['car_type', 'car_brand', 'is_return', 'is_damaged'],
  cruds() {
    return CRUD({ title: '租车管理接口', url: 'api/carRentalInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCarRentalInfo }})
  },
  data() {
    return {
      ids: [],
      customerIds: [],
      permission: {
        add: ['admin', 'carRentalInfo:add'],
        edit: ['admin', 'carRentalInfo:edit'],
        del: ['admin', 'carRentalInfo:del']
      },
      rules: {
        customerId: [
          { required: true, message: '客户不能为空', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '租用车辆不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '客户姓名' },
        { key: 'userPhone', display_name: '联系电话' }
      ]
    }
  },
  created() {
    this.initSelect()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      // const deploys = []
      // form.deploys.forEach(function(deploy, index) {
      //   deploys.push(deploy.id)
      // })
      // this.form.deploys = deploys
    },
    initSelect() {
      crudCarRentalInfo.getCarInfo().then(res => {
        // this.ids = res.data.list
        res.forEach(item => {
          this.ids.push(item)
        })
      })
      crudCarRentalInfo.getCustomerInfo().then(res => {
        res.forEach(item => {
          this.customerIds.push(item)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
