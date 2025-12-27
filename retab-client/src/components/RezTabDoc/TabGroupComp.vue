<template>
    <div class="tab-group" :id="tabGroup.containerElId">
        <div class="flex flex-col gap-y-2 ">
            <DurationSymbol :show-tab-dur-sym="tabGroup.showTabDurSym" :durNum="(tabGroup.dur as DurNum)"
                :dots="tabGroup.durDots" @toggleShowTabDurSym="tabGroup.toggleShowTabDurSym()"
                @change-duration="d => tabGroup.setDur(d)"
                />
        </div>
        <ul class="">
            <li class="staff-line w-full" v-for="(staffLine, index) in tabGroup.staff.lines" :key="index">
                <StaffLineComp :line="staffLine" :tabGroup="tabGroup" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import TabGroup from '@/store/modules/TabGroup';
import { defineProps, onMounted, onUpdated, toRef } from 'vue';
import StaffLineComp from './StaffLineComp.vue';

import DurationSymbol from '@/components/RezTabDoc/DurationSymbol/index.vue'
import { DurNum } from '@/store/modules/types';
import DevTest from '../utils/DevTest.vue';
const props = defineProps<{ tabGroup: TabGroup, tabgroupId: string }>();
onUpdated(setTabgroupContainerId);
onMounted(setTabgroupContainerId);
function setTabgroupContainerId() {toRef(props.tabGroup).value.containerElId = 'tabgroup-container-' + toRef(props.tabgroupId).value }
</script>


<style scoped>
/* .tab-group:first-child ul li.staff-line div {
    padding-left: 0.5rem;
} */
.tab-group.selected {
    background-color: rgba(0, 128, 0, 0.164);
}
</style>