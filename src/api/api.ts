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
export function postDepartments(data: any) {
    return request({
        url: '/department',
        method: 'post',
        data: data
    })
}
export function deleteDepartments(data: any) {
    return request({
        url: '/department/delete',
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
export function getHotTags(){
    return request({
        url: '/tags/hot',
        method: 'get',
    })
}
export function getNormalTags(data:any){
    return request({
        url: '/tags',
        method: 'get',
        params: data
    })
}
export function increaseTagPoint(data:any){
    return request({
        url: '/tag/point',
        method: 'post',
        data: data
    })
}
export function getTagDetail(data:any){
    return request({
        url:'/tag/detail',
        method:'get',
        params:data,
    })
}
export function getClearHot(data:any){
    return request({
        url: '/tag/clear',
        method: 'get',
        params: data,
    })
}
export function getDeleteTags(data:any){
    return request({
        url: '/tag/delete',
        method: 'get',
        params: data,
    })
}
export function getAllUsers(data:any){
    return request({
        url:'/users/common',
        method: 'get',
        params: data
    })
}
export function getOneUser(data:any){
    return request({
        url:'/user/common',
        method: 'get',
        params: data
    })
}
export function postRefreshNickName(data:any){
    return request({
        url: '/user/nickname/reset',
        method: 'post',
        data: data
    })
}
export function postBlocked(data:any){
    return request({
        url: '/blocked',
        method: 'post',
        data: data
    })
}
export function postBanned(data:any){
    return request({
        url: '/banned',
        method: 'post',
        data: data
    })
}
export function getUserPosts(data:any){
    return request({
        url:'/posts/user',
        method:'get',
        params:data,
    })
}
export function getUserCriti(data:any){
    return request({
        url:'/floors/user',
        method:'get',
        params:data,
    })
}
export function getUserDetail(data:any){
    return request({
        url:'/user/detail',
        method:'get',
        params:data,
    })
}