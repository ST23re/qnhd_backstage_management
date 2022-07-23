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
    }[],
    reasons: string[],
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
            text: "可评论"
        },{
            id: 3,
            text: '禁评论'
        }],
        reasons: [
            '散布宗教、迷信、谣言与虚假信息',
            '含有淫秽色情、赌博传销、血腥暴力信息',
            '侵犯他人肖像权或隐私权、恶意辱骂他人进行人身攻击',
            '发布敏感话题',
            '干扰论坛正常运营，侵犯其他用户权益或第三方合法权益',
            '违反相关法律法规或违反《普通高等学校学生管理规定》和天津大学学生管理规定',
        ]
    })
})

export interface Posts_query {
    type: number; //0为所有1为校务，其他类型从帖子类型接口获取
    search_mode: number; //0为按照创建时间，1为按照更新时间
    solved?: number | null; //0为未分发1为已回复2为已解决3为已分发
    department_id?: number | null; //增加限定内容-获取某个部门下的帖子，当type为1的时候使用
    content?: string | null; //搜索帖子内容 包括标题和内容
    tag_id?: number | null; //tag的id
    etag?: string; //筛选etag帖子
    value_mode?: number; //0默认1不将置顶帖额外排序2只看置顶
    commentable?: number | null; //为0获取无法评论的，为1获取可评论的，默认不区分
    is_deleted?: number; //1为获取删除的 默认获取未删除的
    page_disable?: number; //传1关闭分页
    page?: number; //页数, 从1开始 默认为1
    page_size?: number; //页面大小，默认为10
    page_base?: number; //从第n个开始获取
  }
export interface Reports_query {
    sort: number;
    solved: number;
    content: string;
    page: number;
}

export interface Post {
    id: number;
    created_at: string;
    uid: number;
    type: number;
    campus: number;
    solved: number;
    title: string;
    content: string;
    image_urls: string[];
    nickname: string;
    fav_count: number;
    like_count: number;
    comment_count: number;
    rating: number;
    value: number;
    e_tag: string;
    tag: null | {
      id: number;
      name: string;
    };
    department: null | {
      id: number;
      name: string;
      introduction: string;
    };
    floors: null;
    commentable: boolean;
    is_deleted: boolean;
    chosen: boolean;
  }
export interface Reply {
    id: number;
    post_id: number;
    created_at: string;
    content: string;
    image_urls: string[];
    sender: number;
}
export interface SubFloor {
    id: number;
    post_id: number;
    created_at: string;
    uid: number;
    content: string;
    image_url: string;
    nickname: string;
    like_count: number;
    sub_floor_cnt: number;
    reply_to: number; //floor_id
    reply_to_name: string;
    sub_to: number;
    sub_floors: SubFloor[];
    commentable: boolean;
    is_deleted: boolean;
}
export interface Floor {
    id: number;
    post_id: number;
    created_at: string;
    uid: number;
    content: string;
    image_url: string;
    nickname: string;
    like_count: number;
    sub_floor_cnt: number;
    reply_to: number;
    reply_to_name: string;
    sub_to: number;
    sub_floors: SubFloor[];
    commentable: boolean;
    is_deleted: boolean;
}

export const usePost = defineStore(Names.UsePost, {
    state: () => ({
        posts_query: <Posts_query | {}>{},
        reports_query: <Reports_query | {}>{},
        prosecuted_post_id: <number>0,
        prosecuted_floor_id: <number>0,
        user_record_post_id: <number>(0),
        user_record_floor_id: <number>(0),
    })
})