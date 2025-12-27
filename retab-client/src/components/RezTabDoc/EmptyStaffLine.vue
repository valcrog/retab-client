<template>
    <div class="
    border-t-1 border-solid border-gray-500 h-8 staff-line relative
    flex flex-col justify-center 
    " :class="{'ledger-line': line.isLedgerLine,  'italian': line.staff.getTabType() == TabType.ITALIAN}">
    

        <!-- <NoteComp :tabGroup="tabGroup" :line="line" :tabType="line.staff.getTabType()"/> -->
    </div>

</template>

<script setup lang="ts">
import { StaffLine } from '@/store/modules/Staff';
import NoteComp from './NoteComp.vue';
import { computed, defineProps, ref } from 'vue';
import TabGroup from '@/store/modules/TabGroup';
import { useStore } from 'vuex';
import { TabType } from '@/store/modules/types';
const store = useStore()
const props = defineProps<{
    line: StaffLine,
}>()
</script>

<style scoped>
.staff-line:not(.ledger-line)::before, .ledger-line.show-ledger-line::before {
    content: '';
    position: absolute;
    height: 1px;
    bottom: 45%;
    width: 100%;
    display: block;
    background-color: rgb(0, 0, 0, .2);

}
.staff-line.italian::before {
    height: 1px;
    bottom: 65%;

}
.ledger-line.show-ledger-line::before {
    width: 50%;
}




</style>