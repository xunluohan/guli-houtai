import request from '@/utils/request'

// /admin/acl/index/login
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

// /admin/acl/index/info
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// /admin/acl/index/logout
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
