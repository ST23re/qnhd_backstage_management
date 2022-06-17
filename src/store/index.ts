import { defineStore } from "pinia";
import { Names } from "./storeKey";

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
    department?: object,
    auth: string,
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