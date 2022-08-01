import { request } from "@/utils/request";

export function login_twt(data: any) {
  return request({
    url: "/auth/passwd",
    method: "get",
    params: data,
  });
}
export function login(data: any) {
  return request({
    url: "/auth",
    method: "get",
    params: data,
  });
}
export function getInfo(data: any) {
  return request({
    url: "/user/info",
    method: "get",
    params: data,
  });
}
export function getPostTypes(data: any) {
  return request({
    url: "/posttypes",
    method: "get",
    params: data,
  });
}
export function getDepartments(data: any) {
  return request({
    url: "/departments",
    method: "get",
    params: data,
  });
}
export function getPosts(data: any) {
  return request({
    url: "/posts",
    method: "get",
    params: data,
  });
}
export function getTags(data: any) {
  return request({
    url: "/tags",
    method: "get",
    params: data,
  });
}
export function deleteTag(data: any) {
  return request({
    url: "/post_tag/delete",
    method: "get",
    params: data,
  });
}
export function setTag(data: any) {
  return request({
    url: "/post_tag",
    method: "post",
    data,
  });
}
export function setTop(data: any) {
  return request({
    url: "/post/value",
    method: "post",
    data,
  });
}
export function setEtag(data: any) {
  return request({
    url: "/post/etag",
    method: "post",
    data,
  });
}
export function transferPost(data: any) {
  return request({
    url: "/post/transfer/type",
    method: "post",
    data,
  });
}
export function deletePost(data: any) {
  return request({
    url: "/post/delete",
    method: "get",
    params: data,
  });
}
export function recoverPost(data: any) {
  return request({
    url: "/post/recover",
    method: "post",
    data,
  });
}
export function modifyPostCommentable(data: any) {
  return request({
    url: "/post/commentable/edit",
    method: "post",
    data,
  });
}
export function deletePostImage(data: any) {
  return request({
    url: "/post_image/delete",
    method: "get",
    params: data,
  });
}

export function getPost(data: any) {
  return request({
    url: "/post",
    method: "get",
    params: data,
  });
}
export function getReplies(data: any) {
  return request({
    url: "/post/replys",
    method: "get",
    params: data,
  });
}
export function getFloors(data: any) {
  return request({
    url: "/floors",
    method: "get",
    params: data,
  });
}
export function getFloor(data: any) {
  return request({
    url: "/floor",
    method: "get",
    params: data,
  });
}
export function getSubFloors(data: any) {
  return request({
    url: "/floor/replys",
    method: "get",
    params: data,
  });
}

export function deleteFloor(data: any) {
  return request({
    url: "/floor/delete",
    method: "get",
    params: data,
  });
}
export function recoverFloor(data: any) {
  return request({
    url: "/floor/recover",
    method: "post",
    data,
  });
}
export function modifyFloorCommentable(data: any) {
  return request({
    url: "/floor/commentable/edit",
    method: "post",
    data,
  });
}

export function getReports(data: any) {
  return request({
    url: "/reports",
    method: "get",
    params: data,
  });
}
export function solveReport(data: any) {
  return request({
    url: "/report/delete",
    method: "get",
    params: data,
  });
}

////
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
export function resetNickname(data:any){
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
export function getBlockedNum(data:any){
  return request({
      url:'/blocked',
      method:'get',
      params:data
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
// 公告管理 notice_
export function notice_delete(data:any){
  return request({
      url:'/notice/delete',
      method:'get',
      params:data,
  })
}
export function notice_notices(data:any){
  return request({
      url:'/notices',
      method:'get',
      params:data,
  })
}
export function notice_modify(data:any){
  return request({
      url:'/notice/modify',
      method:'post',
      data,
  })
}
export function notice_notice(data:any){
  return request({
      url:'/notice',
      method:'post',
      data,
  })
}