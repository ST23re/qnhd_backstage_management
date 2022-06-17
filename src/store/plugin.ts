import { PiniaPluginContext } from 'pinia'
import { toRaw } from 'vue'

type Options = {
    key?: string
}
const __piniaKey__:string = 'st23re';

const setStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}
const getStorage = (key: string) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
}
const piniaPlugin = (options: Options) => {
    return (context: PiniaPluginContext) => {
        const { store } = context;
        const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`)
        store.$subscribe(() => {
            setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state))
        })
        return { ...data }
    }
}

export default piniaPlugin