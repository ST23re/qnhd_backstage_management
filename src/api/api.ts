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
        params: data,
    })
}