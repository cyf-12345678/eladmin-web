import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/carRentalOrder',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/carRentalOrder/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/carRentalOrder',
    method: 'put',
    data
  })
}

export function selectThisYearCount() {
  return request({
    url: 'api/carRentalOrder/selectThisYearCount',
    method: 'get'
  })
}

export function selectMonthCount() {
  return request({
    url: 'api/carRentalOrder/selectMonthCount',
    method: 'get'
  })
}

export default { add, edit, del, selectThisYearCount, selectMonthCount }
