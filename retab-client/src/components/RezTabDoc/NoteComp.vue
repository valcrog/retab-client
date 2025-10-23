<template>
  <div v-if="note">
    <input @keydown.space="onSpace" autocomplete="false" @paste="(e) => { e.preventDefault() }" @keyup="keyup"
      @keydown="keydown" @keypress="keypress" @focus="onNoteInputFocus"
      class="note-input lute-tab p-1 w-9 border-1 border-red border-solid" maxlength="2" type="string" v-model="fret"
      :id="note.xmlId" />
  </div>
</template>

<script lang="ts" setup>
import { useDoc } from "@/composables/useDoc";
import Note from "@/store/modules/Note";
import RezTabFile from "@/store/modules/RezTabFile";
import { StaffLine } from "@/store/modules/Staff";
import TabGroup from "@/store/modules/TabGroup";
import { DurNum, TabType } from "@/store/modules/types";
import { computed, defineProps, onMounted, onUpdated, ref, ComputedRef, watch, shallowRef } from "vue";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps<{
  tabGroup: TabGroup;
  line: StaffLine;
  tabType: TabType
}>();

// props.tabGroup.notes.find(n => n.course == props.line.courseInfo.number)!)
const note = computed(() => props.tabGroup.getNoteOnCourse(props.line.courseInfo.number)!);
const fret = ref<string | number | undefined>(note.value?.getFretToShow());

watch(fret, val => {
  
  if (/^[\u0080-\uFFFF]+$/.test(val + '')) {
    if (note.value.getFretToShow().includes(val + '') ) {
      useDoc().snapshot();
      val = note.value.fret?.toString().slice(0, val?.toString().length)
    } else return;
    
  }
  useDoc().snapshot();
  setFret(val);
  note.value.focus();
})
function setFret(val: any) {//: string | number) {
  // test if the second digit has been added
  const exec = /^[\u0080-\uFFFF](\d)/.exec(val)
  console.log({val}, exec);
  
  if (!exec) {
    if (val == '')  {
      val = undefined
    }
    note.value.fret = val;
    const toShow = note.value.getFretToShow();
    
    if (fret.value != toShow) fret.value = toShow
  } else {
    const firstDigit = note.value.fret
    const secondDigit = exec[1];
    const twoDigitFret = Number(firstDigit + '' + secondDigit);
    if (twoDigitFret <= Note.MAX_FRET_INPUT) {
      note.value.fret = twoDigitFret
      fret.value = note.value.getFretToShow();
    } else {
      fret.value = note.value.getFretToShow();
    }
    
  }
}


function onSpace() {
  useDoc().snapshot();
  event?.preventDefault();
  // useDoc().snapshot();
  const newTabGroup = props.tabGroup.staff.addTabGroup();
  newTabGroup.setDur(props.tabGroup.dur)
  const newNoteOnTheSameCourse = newTabGroup.notes.find(n => n.course == note.value.course)
  setTimeout(() => {
    newNoteOnTheSameCourse?.focus()
  }, 50)
}



onMounted(() => {
  note.value?.setupEl();
})
onUpdated(() => {
  // 
})

function keypress(event: KeyboardEvent) {
  if (event.key == 'Insert' && event.shiftKey) event.preventDefault();

}
function keydown(event: KeyboardEvent) {
  if (event.key == '.' || event.key == 'p') {
    useDoc().snapshot();
    
    event.stopPropagation()
    event.preventDefault();
    
    note.value.tabGroup.dot()
    
    
    return false
  }

}
function onNoteInputFocus() {
  const doc = (store.state.currentDoc as RezTabFile);
  doc.lastFocusedNote = note.value
  return;
}

function keyup(event: KeyboardEvent) {
  if (event.key == 'D') {
    console.log(note.value.getDebugData())
  }
  // change the durSym:
  if (event.altKey) {
    event.preventDefault()
    const currentDuration = note.value.tabGroup.dur;
    const newDuration: DurNum | undefined = ["ArrowUp", "ArrowRight"].includes(event.key) ? currentDuration / 2 as DurNum :
      ["ArrowDown", "ArrowLeft"].includes(event.key) ? currentDuration * 2 as DurNum
        : undefined;
    if (newDuration) note.value.changeDuration(newDuration)
    return;

  } else if (event.shiftKey) {
    if (event.key == 'Delete') {
      event.preventDefault()
      const prevNoteToFocus = note.value.getLeftNote();
      
      note.value.tabGroup.remove();
      prevNoteToFocus?.focus();
      return false;

    } else if (event.key == 'Insert') {
      event.preventDefault()
      note.value.tabGroup.insertTabgroupBefore();
      note.value.getLeftNote()?.focus()
    }
  } else if (event.ctrlKey) {
    if (event.key == 'Insert') {
      event.preventDefault()
      // wanna insert a measure before the current one:
      const currentMeasureIndex = note.value.tabGroup.staff.measure.section.measures.indexOf(note.value.tabGroup.staff.measure)
      const newMeasure = note.value.tabGroup.staff.measure.section?.addMeasure(currentMeasureIndex);
      newMeasure.findCurrentStaff(note.value).tabGroups[0].focus(note.value.course)
      // const prevNoteToFocus = note.value.getLeftNote();
      // note.value.tabGroup.remove();
      // prevNoteToFocus?.focus()

    }
  } else {
    const tabType = useDoc().getTabType();
    const otherNote = event.key == "ArrowUp" ? tabType == TabType.FRENCH ? note.value.getBelowNote() : note.value.getAboveNote()
      : event.key == "ArrowDown" ? tabType == TabType.FRENCH ? note.value.getAboveNote() : note.value.getBelowNote()
        : event.key == "ArrowRight" ? note.value.getRightNote()
          : event.key == "ArrowLeft" ? note.value.getLeftNote()
            : undefined;
    otherNote?.focus();
  }
}
// function onFocus() {
//   
// }
</script>



<style scoped>
.note-input:hover {
  background-color: rgba(0, 0, 0, 0.089) !important;
}

.note-input {

  background-color: unset !important;
  outline: red;
}


.note-input.selected {
  color: rgb(12, 202, 12) !important;

}
</style>