<template>
    <div class=" border-solid border-2 w-fit toolbar select-none">
        <div class="flex">
            <va-popover v-for="(tool, index) in docTools" :key="index" color="primary" class="bg-opacity-5"
                @click="tool.cb" :message="tool.tooltipText" :hover-over-timeout="1000">
                <div class="cursor-pointer hover:bg-opacity-15 p-1  hover:bg-slate-900">
                    <va-icon :name="tool.icon" :spin="tool.spin" />
                </div>
            </va-popover>
            <!-- Note Tools -->
            <va-popover v-for="(tool, index) in noteTools" :key="index" color="primary" class="bg-opacity-5"
                @click="tool.cb" :message="tool.tooltipText" :hover-over-timeout="1000">
                <div class="cursor-pointer hover:bg-opacity-15 p-1 hover:bg-slate-900 flex items-end"
                    :class="{ 'opacity-50': !focusedNote?.el }">
                    <div class="flex flex-col justify-end h-full">
                        <component :is="tool.component" />
                    </div>
                </div>
            </va-popover>
        </div>

    </div>

</template>

<script setup lang="ts">
import AccidedPname from '@/components/utils/signs/AccidedPname.vue'
import { useDoc } from '@/composables/useDoc'
import { } from '@heroicons/vue/24/solid'
import  {  computed, onMounted, Ref, ref, shallowRef }  from 'vue'
import  * as vue from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui/web-components'
import { useStore } from 'vuex'
import DotToolComp from './DotToolComp.vue'
import Note from '@/store/modules/Note'
import TestTool from './TestTool.vue'
import DevTest from '@/components/utils/DevTest.vue'

type Tool = {
    icon?: string,
    tooltipText?: string,
    cb: (...args: any) => any,
    spin?: 'counter-clockwise',
    stateOn?: boolean,
    component?: vue.Component;
}

const docTools: Ref<Tool[]> = ref([
    {
        icon: 'undo',
        tooltipText: 'Undo',
        cb: () => useDoc().undo()
    },
    {
        tooltipText: 'Redo',
        icon: 'redo',
        cb: () => useDoc().redo()
    },
    {

        icon: 'save',
        tooltipText: 'save doc',
        cb: () => save()
    },

])


onMounted(() => {
    // console.log('mounted ' + Date.now())
})
const store = useStore();
const isSaving = ref(false)
const toast = useToast();
const router = useRouter();
const LOADING_ICON = 'va-loading'
const props = defineProps<{
    selectedNotes?: Note[]
}>();

const selectedNotes = shallowRef(props.selectedNotes)
const focusedNote = computed(() => useDoc().getFocusedNote())
async function save() {
    isSaving.value = true
    setIconLoading('save');
    const doc = useDoc();
    let wannaRefreshThepage = !doc.id;
    const result = await doc.save();
    toast.init({
        color: 'success', message: 'Saved Successfully.',
        position: 'bottom-right'
    })



    doc.id = result.id
    doc.unfreeze();
    unsetIconLoading('save')
    isSaving.value = false
    if (wannaRefreshThepage) {
        return router.push({ path: '/doc/' + doc.id }), 1000
    } else return doc.unfreeze();

}


function setIconLoading(iconName: string) {
    const tool = docTools.value.find(t => t.icon == iconName)
    if (tool) {
        tool.icon = LOADING_ICON
        tool.spin = 'counter-clockwise'
    }

}


function unsetIconLoading(iconName: string) {
    const tool = docTools.value.find(t => t.icon == LOADING_ICON)
    if (tool) {
        tool.icon = iconName
        delete tool.spin
    }

}


const noteTools = shallowRef<Tool[]>([
    {
        tooltipText: 'dot',
        cb() {
            console.log('dot cb');
                        
            if (selectedNotes.value?.length) {
                const tabgroups = selectedNotes.value.map(n => n.tabGroup).filter((tg, index, arr) => arr.indexOf(arr.find(i => i.xmlId == tg.xmlId)!) == index);
                console.log(tabgroups);
                const someAreNotDotted = tabgroups.find(tg => tg.durDots == 0);

                if (someAreNotDotted) tabgroups.forEach(t => t.dot(1))
                else tabgroups.forEach(t => t.dot(0))
                console.log(tabgroups.map(t => t.durDots));
                
            } else focusedNote.value?.tabGroup.dot();
            focusedNote.value?.focus()
        },
        component: DotToolComp
    },
    // {
    //     tooltipText: 'dot',
    //     cb() {
    //         console.log(selectedNotes.value);
    //     },
    //     component: TestTool
    // },
])
</script>