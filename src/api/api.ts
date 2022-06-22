import { request } from '@/utils/request'

export function login_twt(data: any) {
    return request({
        url: '/auth/passwd/',
        method: 'get',
        params: data
    })
}
export function login(data: any) {
    return request({
        url: '/auth',
        method: 'get',
        params: data
    })
}
export function getInfo(data: any) {
    return request({
        url: '/user/info',
        method: 'get',
        params: data
    })
}
export function getPostTypes(data: any) {
    return request({
        url: '/posttypes',
        method: 'get',
        params: data
    })
}
export function getDepartments(data: any) {
    return request({
        url: '/departments',
        method: 'get',
        params: data
    })
}
export function getPosts(data: any) {
    return request({
        url: '/posts',
        method: 'get',
        params: data
    })
}