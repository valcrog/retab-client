<template>
    <div class="measure" :class="{
        'size-exceeded': getMeasure()?.wrongSize == 1
    }">
            <DevTest>
                <span class="bar-number">{{ measureN }}</span>
                        <va-button @click="useDoc().updateUI()">
            <va-icon name="refresh"></va-icon>
        </va-button>
            </DevTest>
        <StaffComp 
        :staff-index="index"
        v-for="(staff, index) in getMeasure()?.staves" :staffN="staff.n" :key="index * store.state.utils.keyCoefficient"
        :measureN="measureN"
        ></StaffComp>
    </div>

</template>

<script lang="ts" setup>
import Measure from '@/store/modules/Measure';
import {defineProps} from 'vue'
import StaffLineComp from './StaffLineComp.vue';
import TabGroupComp from './TabGroupComp.vue';
import { useStore } from 'vuex';
import StaffComp from './StaffComp.vue';
import RezTabFile from '@/store/modules/RezTabFile';

import TimeSignature from './TimeSignature.vue';
import DevTest from '../utils/DevTest.vue';
import { useDoc } from '@/composables/useDoc';
const store = useStore();
const props = defineProps<{measureN: number, keyK: number}>()
function getMeasure() {
    return (store.state.currentDoc as RezTabFile).section.getMeasureFromN(props.measureN)
}

</script>

<style scoped>
.measure {
    border-right: solid black 1px;
}

.size-exceeded {
    background-color: rgba(255, 0, 0, 0.034);
}

.bar-number {
    @apply bg-blue-400/40 p-2 text-center flex items-center font-bold h-8 w-8 justify-center rounded-[50%] shadow-sm ;
}
</style>