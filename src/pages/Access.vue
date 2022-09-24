<template>
    <div class="card-wrapper">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <div>
                        <span style="fontSize:18px;fontWeight:bold;">访问设置</span>
                    </div>
                    <!--                     <el-switch class="button" v-model="front" inline-prompt active-text="是" inactive-text="否" :change="changeJudge()"/> -->
                    <div class="switch-wrapper">
                        <div class="block" :style="block_position"></div>
                        <div class="can-access" @click="open()" :style="text_color1">
                            <span>开启访问</span>
                        </div>
                        <div class="not-access" @click="close()" :style="text_color2">
                            <span>关闭访问</span>
                        </div>
                    </div>
                </div>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { getSetting, postSetting } from '@/api/api';
import { onMounted, ref, reactive } from 'vue';
interface SettingVisit {
    can_visit: string,
}
var setting_false = reactive<SettingVisit>({
    can_visit: '1',
});
var setting_true = reactive<SettingVisit>({
    can_visit: '0',
});
var text_color1 = reactive({
    color: "white",
})
var text_color2 = reactive({
    color: "black",
})
var block_position = reactive({
    left: "0%",
})
function close() {
    block_position.left = "50%";
    text_color2.color = "white";
    text_color1.color = "black";
    postSetting(setting_true).then((res: any) => {
        console.log(res);
    })
}
function open() {
    block_position.left = "0%";
    text_color1.color = "white";
    text_color2.color = "black";
    postSetting(setting_false).then((res: any) => {
        console.log(res);
    })
}
onMounted(() => {
    getSetting().then((res: any) => {
        if(res.data.front_visit) open();
        else close();
    })
})
</script>
<style lang="less" scoped>
.card-wrapper {
    display: flex;
    margin: 20px auto;
    width: 95%;
    justify-content: center;

    .box-card {
        width: 100%;

        .card-header {
            display: flex;
            justify-content: space-between;

            .switch-wrapper {
                box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
                position: relative;
                display: flex;
                border: none;
                outline: none;
                border-radius: 8px;
                height: 37px;
                background-color: #f4f4f5;
                transform: scale(1);
                margin: 5px;

                .block {
                    position: fixed;
                    border-radius: 8px;
                    background-color: #005187;
                    height: 100%;
                    width: 50%;
                    z-index: -1;
                    left: 0%;
                    transition: all 0.7s;
                }

                .can-access {
                    border: none;
                    outline: none;
                    padding: 0px 12px;
                    font-size: 14px;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .not-access {
                    border: none;
                    outline: none;
                    padding: 0px 12px;
                    font-size: 14px;
                    border-radius: 8px;
                    color: #606266;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

            }
        }
    }
}
</style>