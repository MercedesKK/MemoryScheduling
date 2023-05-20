<template>
    <a-layout>
        <a-layout-header class="a-layout-header" :style="{ background: '#fff' }">
            <p style="font-size: 22px;"><b>请求调页存储管理方式模拟</b></p>
        </a-layout-header>
    </a-layout>
    <a-layout has-sider>
        <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'sticky' }" theme="light" width="400px">
            <a-row justify="center">
                <a-col :span="24" style="text-align: center;">
                    <a-button type="primary" @click="nextStep">
                        单步执行
                    </a-button>
                </a-col>
            </a-row>
            <a-row justify="center" style="margin-top: 10px;">
                <a-col :span="24" style="text-align: center;">
                    <p><b>Memory</b></p>
                </a-col>
            </a-row>
            <a-row justify="center">
                <a-col :span="24" style="text-align: center;" v-for="memory_block in memory" :key="memory_block.id">
                    <label class="view-button-label">{{ memory_block.id }}</label>
                    <a-button class="view-button" type="dashed" disabled ghost>{{ memory_block.content }}</a-button>
                    <label class="view-button-label">address: {{ memory_block.address }}</label>
                </a-col>
            </a-row>

            <a-row justify="center">
                <a-col style="text-align: center;" :span="8">
                    <p><b>已执行条数</b></p>
                </a-col>
                <a-col style="text-align: center;" :span="8">
                    <p><b>缺页数</b></p>
                </a-col>
                <a-col style="text-align: center;" :span="8">
                    <p><b>缺页率</b></p>
                </a-col>
            </a-row>
            <a-row justify="center">
                <a-col style="text-align: center;" :span="8">
                    <p><b>{{ exeNum }}</b></p>
                </a-col>
                <a-col style="text-align: center;" :span="8">
                    <p><b>{{ pageMiss }}</b></p>
                </a-col>
                <a-col style="text-align: center;" :span="8">
                    <p><b>{{ missRate }} </b></p>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <a-table :columns="leftColumns" :data-source="leftData" bordered>
                        <template #bodyCell="{ column, text }">
                            <!-- // column是什么 -->
                            <template v-if="column.dataIndex === 'name'">
                                <a>{{ text }}</a>
                            </template>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-layout-sider>

        <a-layout>

            <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
                <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
                    <a-row>
                        <a-col :span="24">
                            <a-table :columns="rightColumns" :data-source="rightData" bordered>
                                <template #bodyCell="{ column, text }">
                                    <!-- // column是什么 -->
                                    <template v-if="column.dataIndex === 'name'">
                                        <a>{{ text }}</a>
                                    </template>
                                </template>
                            </a-table>
                        </a-col>
                    </a-row>
                </div>
            </a-layout-content>
            <a-layout-footer :style="{ textAlign: 'center' }">
                2023 Created by Jingkai Zhang
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import linklist from '../scripts/LRUCache'

// 数据结构
let exeNum = ref(0);
let pageMiss = ref(0);
let lruCache = new linklist.linklist();

const memoryBlockNum = 4;
const PageTableNum = 32; // 页表数
const instructionNum = 320;
let memory = ref([]);
let pageTable = ref([]); // 页表
let exeOrder = ref([]); // 指令执行顺序
let instructionRecord = ref([]);

let missRate = computed(() => {
    if (exeNum.value === 0) {
        return 0 + "%";
    }
    else {
        return ((pageMiss.value / exeNum.value) * 100).toFixed(2) + "%";
    }
});

// 表格
const leftColumns = ref([
    {
        title: "调入逻辑页",
        dataIndex: "pageId",
    },
    {
        title: "调至内存块",
        dataIndex: "block",
    },
    {
        title: "调出逻辑页",
        dataIndex: "pageOut",
    },
]);
let leftData = ref([]);

const rightColumns = ref([
    {
        title: "指令ID",
        dataIndex: "instructionId",
    },
    {
        title: "逻辑页号",
        dataIndex: "pageId",
    },
    {
        title: "所在内存块号",
        dataIndex: "inMemory",
    },
    {
        title: "所在内存地址",
        dataIndex: "address",
    },
    {
        title: "下一条指令ID",
        dataIndex: "nextInstructionId",
    },
]);
let rightData = ref([]);

// 函数


const memoryInit = () => {
    for (let i = 0; i < memoryBlockNum; i++) {
        memory.value.push({
            id: i,
            address: i + "0",
            length: 10,
            content: "null"
        });
    }
}

const pageTableInit = () => {
    for (let i = 0; i < PageTableNum; i++) {
        pageTable.value.push({
            id: i,
            valid: false,
            memoryId: null
        });
    }
}

const orderInit = () => {
    let randomOrder = Math.floor(Math.random() * (instructionNum - 1));
    let i = 0;
    exeOrder.value.push(randomOrder);
    i++;
    exeOrder.value.push(randomOrder + 1);
    i++;
    // console.log(exeOrder.value);
    while (i < instructionNum) {
        randomOrder = Math.floor(Math.random() * randomOrder);
        exeOrder.value.push(randomOrder);
        i++;
        if (i === instructionNum) {
            return;
        }
        exeOrder.value.push(randomOrder + 1);
        i++;
        if (i === instructionNum) {
            return;
        }
        randomOrder = Math.floor(Math.random() * (instructionNum - randomOrder - 4) + randomOrder + 2); //跳转至后 m+2 - 319
        exeOrder.value.push(randomOrder);
        i++;
        if (i === instructionNum) {
            return;
        }
        exeOrder.value.push(randomOrder + 1);
        i++;
        if (i === instructionNum) {
            return;
        }
    }
}

const instructionRecordUpdate = (instructionId) => {
    let pageId = Math.floor(instructionId / 10);
    let singleRecord;
    if (pageTable.value[pageId].valid == false) {
        singleRecord = {
            instructionId,
            pageId,
            inMemory: "null",
            address: "null",
            nextInstructionId: exeOrder.value[exeNum.value + 1]
        }
        instructionRecord.value.push(singleRecord);
    }
    else {
        let blockId = pageTable.value[pageId].memoryId;
        let addr = parseInt(memory.value[blockId].address, 10) + (instructionId % 10); // 有问题
        singleRecord = {
            instructionId,
            pageId,
            imMemory: blockId,
            address: addr,
            nextInstructionId: exeOrder.value[exeNum.value + 1]
        }
        instructionRecord.value.push(singleRecord);
    }
    rightData.value.push(singleRecord);
}



const nextStep = () => {
    let instructionId = exeOrder.value[exeNum.value];
    let pageId = Math.floor(instructionId / 10);
    let page = pageTable.value[pageId];
    let singleRecord;
    // console.log(pageTable.value);
    if (page.valid == false) {
        instructionRecordUpdate(instructionId);
        pageMiss.value += 1;
        // lruCache.put(pageId, pageId);
        singleRecord = LRUToMemory(page);   //
        leftData.value.push(singleRecord);  // 
        pageTable.value[pageId].valid = true;
        pageTable.value[pageId].memoryId = singleRecord.block;
        instructionRecordUpdate(instructionId);
        if (singleRecord.pageOut != "null") {
            pageTable.value[singleRecord.pageOut].valid = false;
            pageTable.value[singleRecord.pageOut].memoryId = "null";
        }
    }
    else {
        lruCache.movetoHead(lruCache.findIndex(page.memory_id));
        instructionRecordUpdate(instructionId);
    }
    exeNum.value += 1;
}

const LRUToMemory = (page) => {
    // console.log(lruCache.cache.size);
    if (lruCache.length() < memoryBlockNum) {
        for (let i = 0; i < memoryBlockNum; i++) {
            if (memory.value[i].content == "null") {
                memory.value[i].content = page.id;
                lruCache.insertHead(i);
                return {
                    pageId: page.id,
                    block: i,
                    pageOut: "null"
                }
            }
        }
    }
    else { // 内存满了
        // let beforeCacheHeadValue = lruCache.getHead().value;
        // let beforeCacheTailValue = lruCache.getTail().value; // 被调出的页号
        let dst_block_id = lruCache.deleteLast();
        let page_out_id = memory.value[dst_block_id].content;
        memory.value[dst_block_id].content = page.id; //将新页调入
        lruCache.insertHead(dst_block_id);
        return {
            pageId: page.id,
            block: dst_block_id,
            pageOut: page_out_id
        }
    }
}

// 生命周期钩子
onBeforeMount(() => {
    memoryInit();
    pageTableInit();
    orderInit();
})


</script>

<style scoped>
.a-layout-header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.view-button-label {
    margin: 10px;
}

.view-button {
    width: 70px;
}
</style>