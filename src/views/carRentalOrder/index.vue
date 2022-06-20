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
        <label class="el-form-item-label">证件号码</label>
        <el-input v-model="query.userCertifcode" clearable placeholder="证件号码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">车牌号</label>
        <el-input v-model="query.carCode" clearable placeholder="车牌号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" />
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
        <el-table-column prop="carRentalTime" label="租车时长" />
        <el-table-column prop="carRentalStart" label="租车开始时间" />
        <el-table-column prop="carRentalEnd" label="租车结束时间" />
        <el-table-column prop="carType" label="车辆类型(字典)">
          <template slot-scope="scope">
            {{ dict.label.car_type[scope.row.carType] }}
          </template>
        </el-table-column>
        <el-table-column prop="carCode" label="车牌号" />
        <el-table-column prop="carSeat" label="座位数" />
        <el-table-column prop="carBrand" label="车辆品牌（字典）">
          <template slot-scope="scope">
            {{ dict.label.car_brand[scope.row.carBrand] }}
          </template>
        </el-table-column>
        <el-table-column prop="customerId" label="客户id" />
        <el-table-column prop="carRentalFee" label="每小时租车费" />
        <el-table-column prop="carDeposit" label="押金" />
        <el-table-column prop="isRent" label="是否被租">
          <template slot-scope="scope">
            {{ dict.label.is_return[scope.row.isRent] }}
          </template>
        </el-table-column>
        <el-table-column prop="isDamaged" label="是否损坏">
          <template slot-scope="scope">
            {{ dict.label.is_damaged[scope.row.isDamaged] }}
          </template>
        </el-table-column>
        <el-table-column prop="carCompensate" label="损坏赔偿" />
        <el-table-column prop="createUser" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','carRentalOrder:edit','carRentalOrder:del'])" label="操作" width="150px" align="center">
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
import crudCarRentalOrder from '@/api/carRentalOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, userPhone: null, userCertifcode: null, carRentalTime: null, carRentalStart: null, carRentalEnd: null, carType: null, carCode: null, carSeat: null, carBrand: null, customerId: null, carRentalFee: null, carDeposit: null, isRent: null, isDamaged: null, carCompensate: null, createUser: null, createTime: null, updateUser: null, updateTime: null, userSource: null }
export default {
  name: 'CarRentalOrder',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['car_type', 'car_brand', 'is_return', 'is_damaged'],
  cruds() {
    return CRUD({ title: '订单接口', url: 'api/carRentalOrder', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCarRentalOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'carRentalOrder:add'],
        edit: ['admin', 'carRentalOrder:edit'],
        del: ['admin', 'carRentalOrder:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'name', display_name: '客户姓名' },
        { key: 'userPhone', display_name: '联系电话' },
        { key: 'userCertifcode', display_name: '证件号码' },
        { key: 'carCode', display_name: '车牌号' }
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
