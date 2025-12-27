<template>
    <div class="flex">

        <TimeSignature v-if="getStaff()?.measure.showTimeSignature()" :staff="(getStaff() as Staff)" />
        <!-- increase <span class="text-xl font-bold cursor-pointer"  @click="store.state.currentDoc.staves[props.staffIndex]?.addMeasure()">+</span> -->
        <div class="flex">
            <TabGroupComp class="inline-block" :tabGroup="tabGroup" v-for="(tabGroup, index) in getStaff()?.tabGroups
             " :key="index" :tabgroupId="`${measureN}-${staffN}-${index}`" />


        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useStore } from 'vuex';
import TabGroupComp from './TabGroupComp.vue';
import RezTabFile from '@/store/modules/RezTabFile';
import { useDoc } from '@/composables/useDoc';
import TimeSignature from './TimeSignature.vue';
import EmptyTabgroup from './EmptyTabgroup.vue';
import Staff from '@/store/modules/Staff';
const store = useStore();
const props = defineProps<{
    staffN?: number,
    measureN?: number
}>();

function getStaff() {
    return (store.state.currentDoc as RezTabFile).section.getMeasureFromN(props.measureN!)?.getStaffFromN(props.staffN)

}

</script>