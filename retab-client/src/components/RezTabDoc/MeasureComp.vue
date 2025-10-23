<template>
    <div class="measure">
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
</style>