<template>
    <div>
        
    </div>
    <!-- <div class="flex gap-x-2 my-2 items-center">
        <va-button @click="generate" class="">
            GENERATE DOC
        </va-button>
        <va-button @click="save" class=" font-bold cursor-pointer">SAVE</va-button>
        <DevTest>
            <va-button @click="logDoc" class=" font-bold cursor-pointer">
                Log Doc
            </va-button>

        </DevTest>
        <div>{{ getDoc().section.info.staves[0] }}</div>
    </div> -->
</template>


<script setup lang="ts">
import RezTabFile from '@/store/modules/RezTabFile';
import { ref } from 'vue';
import { useToast } from 'vuestic-ui/web-components';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useDoc } from '@/composables/useDoc';
const store = useStore();
const router = useRouter();
async function generate() {
    // we can use doc.generateAndDownloadMei() instead of all this;
    const doc = store.state.currentDoc as RezTabFile;
    const result = await doc.generateMEI();
    const altTitle = doc.getAltTitle()
    RezTabFile.download(result, altTitle ? altTitle + '.mei' : undefined);
    doc.unfreeze()

}
const debugIntervalId = ref();
const toast = useToast();

function getDoc() { return store.state.currentDoc as RezTabFile }
function logDoc() {
    const doc = getDoc()
    doc.setupNotesEls();
    
    // doc.getAllNotes().forEach(n => n.tabGroup.updateSelectionMode(false))
}
</script>