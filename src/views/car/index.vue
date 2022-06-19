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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="车辆类型">
                <el-select v-model="form.carType" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.car_type"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆品牌">
                <el-select v-model="form.carBrand" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.car_brand"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="客户id">
                <el-input v-model="form.customerId" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否损坏">
                <el-select v-model="form.isDamaged" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.is_damaged"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="车牌号">
                <el-input v-model="form.carCode" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="座位数">
                <el-input v-model="form.carSeat" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="每小时租车费" prop="carRentalFee">
                <el-input v-model="form.carRentalFee" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="押金">
                <el-input v-model="form.carDeposit" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="12">
              <el-form-item label="是否被租">
                <el-select v-model="form.isRent" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.is_return"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="损坏赔偿">
                <el-input v-model="form.carCompensate" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="创建人" prop="createUser">
            <el-input v-model="form.createUser" style="width: 100%;" />
          </el-form-item>
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
        <!--        <el-table-column prop="createUser" label="创建人" />-->
        <!--        <el-table-column prop="createTime" label="创建时间" />-->
        <!--        <el-table-column prop="updateUser" label="更新人" />-->
        <!--        <el-table-column prop="updateTime" label="更新时间" />-->
        <el-table-column prop="customerId" label="客户id" />
        <el-table-column prop="carCode" label="车牌号" />
        <el-table-column prop="carSeat" label="座位数" />
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
        <el-table-column v-if="checkPer(['admin','carInfo:edit','carInfo:del'])" label="操作" width="150px" align="center">
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
import crudCarInfo from '@/api/carInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, carType: null, carBrand: null, createUser: null, createTime: null, updateUser: null, updateTime: null, customerId: null, isDamaged: null, carCode: null, carSeat: null, carRentalFee: null, carDeposit: null, isRent: null, carCompensate: null }
export default {
  name: 'CarInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['car_type', 'car_brand', 'is_return', 'is_damaged'],
  cruds() {
    return CRUD({ title: '车辆管理接口', url: 'api/carInfo', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCarInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'carInfo:add'],
        edit: ['admin', 'carInfo:edit'],
        del: ['admin', 'carInfo:del']
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
        ],
        carRentalFee: [
          { required: true, message: '每小时租车费不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'carType', display_name: '车辆类型' },
        { key: 'carBrand', display_name: '车辆品牌' }
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
