import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/carRentalInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/carRentalInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/carRentalInfo',
    method: 'put',
    data
  })
}

export function getCarInfo() {
  return request({
    url: 'api/carInfo/list',
    method: 'get'
  })
}

export function getCustomerInfo() {
  return request({
    url: 'api/customerInfo/list',
    method: 'get'
  })
}

export default { add, edit, del, getCarInfo, getCustomerInfo }
