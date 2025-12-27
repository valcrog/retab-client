<template>
    <div class="timesig-container relative">
        <EmptyTabgroup :staff="staff" class="min-w-20"/>
        <div class="absolute top-0 left-0 bottom-0 right-0">
            <div  class="h-full flex flex-col justify-center">
                <div v-if="!!useDoc().docSettings.proportion.sign" class="flex items-center h-full">
                    <component :is="useDoc().docSettings.proportion.slash ? CSlashSign : CSign" class="max-w-8"/>
                </div>
                <div v-else>

                    <!-- Above -->
                    <div class="timesig-number lute-tab">
                        {{ numToShow }}
                    </div>
                    <!-- Below -->
                    <div class="timesig-number lute-tab">
                        {{ numbaseToShow }}
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import { useDoc } from '@/composables/useDoc';
import Note from '@/store/modules/Note';
import Staff from '@/store/modules/Staff';
import { computed, ref } from 'vue';
import EmptyTabgroup from './EmptyTabgroup.vue';
import CSlashSign from '../svg/CSlashSign.vue';
import CSign from '../svg/CSign.vue';

const tmp = ref('');
const numToShow = computed(() => toShow(useDoc().docSettings.proportion.num))
const numbaseToShow = computed(() => toShow(useDoc().docSettings.proportion.numbase))
defineProps<{
    staff: Staff
}>()

function toShow(n: number) {
    console.log({ n });
    return Note.ITALIAN_TAB_UNICODES[n] || 0

}
</script>


<style scoped>
.timesig-number {
    font-size: 10rem;
    line-height: 10rem;
}
</style>