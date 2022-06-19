import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/carInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/carInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/carInfo',
    method: 'put',
    data
  })
}

export function doSure(data) {
  return request({
    url: 'api/carInfo/doSure',
    method: 'put',
    data
  })
}

export default { add, edit, del, doSure }
