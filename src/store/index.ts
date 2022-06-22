import { defineStore } from "pinia";
import { Names } from "./storeKey";

type Type = {
    id: number,
    shortname: string,
    name: string
}
type Department = {
    id: number | null,
    name: string,
    introduction: string
}
type Info = {
    id: number,
    nickname: string,
    phone_number: string | number,
    active: boolean,
    is_user: boolean,
    is_sch_admin: boolean,
    is_sch_dis_admin: boolean,
    is_stu_admin: boolean,
    is_super: boolean,
    department?: Department,
    auth: string
}
export const useInfo = defineStore(Names.UseInfo, {
    state: () => (<Info>{
        id: 0,
        nickname: '',
        phone_number: 0,
        active: true,
        is_user: true,
        is_sch_admin: false,
        is_sch_dis_admin: false,
        is_stu_admin: false,
        is_super: false,
        auth: '',
    }),
    getters: {
    },
    //同步异步都可以做
    actions: {
        // setInfo(payload: Info) {}
    }
})
type GlobalData = {
    width: number,
    height: number,
    postTypes: Type[],
    departments: Department[],
    sortMode: {
        id: number,
        text: string
    }[],
    eTag: {
        id: string,
        text: string
    }[],
    solved: {
        id: number | null,
        text: string
    }[],
    status: {
        id: number,
        text: string
    }[]
}
export const useGlobalData = defineStore(Names.UseGlobalData, {
    state: () => (<GlobalData>{
        width: 0,
        height: 0,
        postTypes: [{
            id: 0,
            shortname: "全部",
            name: "全部",
          }],
        departments: [{
            id: null,
            name: '所有部门',
            introduction: '无'
        }],
        sortMode: [{
            id: 0,
            text: '默认'// search 1 value 0
        },{
            id: 1,
            text: "以更新时间",// search 1 value 1
        },{
            id: 2,
            text: "以创建时间",// search 0 value 1
        }],
        eTag: [{
            id: '',
            text: '全部'
        },{
            id: 'top',
            text: '置顶帖'
        },{
            id: 'recommend',
            text: '加精帖'
        },{
            id: 'theme',
            text: '活动帖'
        }],
        solved: [{
            id: null,
            text: '全部'
        },{
            id: 0,
            text: '未解决'
        },{
            id: 3,
            text: '已分发'
        },{
            id: 1,
            text: '已回复'
        },{
            id: 2,
            text: '已解决'
        }],
        status: [{
            id: 0,
            text: "未删除"
        },{
            id: 1,
            text: "已删除"
        },{
            id: 2,
            text: "畅言"
        },{
            id: 3,
            text: '禁言'
        }] 
    })
})