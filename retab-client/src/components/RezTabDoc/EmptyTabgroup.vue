<template>
    <div class="empty-tab-group">
        <div class="flex flex-col gap-y-2 ">
            <DurationSymbol  :durNum="1" :show-tab-dur-sym="false"
                :dots="0" :empty="true"
                />
        </div>
        <ul class="">
            <li class="staff-line w-full" v-for="(staffLine, index) in staff.lines" :key="index">
                <EmptyStaffLine :line="staffLine"  />
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
import Staff from '@/store/modules/Staff';
import EmptyStaffLine from './EmptyStaffLine.vue';
const props = defineProps<{ staff: Staff }>();
</script>


<style scoped>
/* .tab-group:first-child ul li.staff-line div {
    padding-left: 0.5rem;
} */
.tab-group.selected {
    background-color: rgba(0, 128, 0, 0.164);
}
</style>