<template>
    <div class="proportion-selector">

        <div>

            <va-checkbox label="Fixed Measures" v-model="getDoc().docSettings.fixedMeasures" @update:modelValue="getDoc().docSettings.proportion.include = true" />
        </div>
        <va-checkbox v-model="getDoc().docSettings.proportion.include"
            :class="{ 'enabled': getDoc().docSettings.proportion.include }" label="Include Proportion" />
        <div class="grid gap-x-2 grid-cols-3 items-start">
            <va-input :disabled="!getDoc().docSettings.proportion.include" color="white" type="number" label="num"
                v-model="num" />
            
            <va-input :disabled="!getDoc().docSettings.proportion.include" color="white" type="number" label="numbase"
                v-model="numbase" />
            <div class="sign-checkboxs">
                <va-checkbox label="show sign" v-model="showSign"
                    :disabled="!getDoc().docSettings.proportion.include || !(
                        (num == 2 && numbase == 2) || (num == 4 && numbase == 4)
                    )" />
                <label for="c-sign-input" :class="{ 'opacity-55': !(showSign && isCSign) }">
                    <input type="checkbox" id="c-sign-input" v-model="isCSign"
                        :disabled="!getDoc().docSettings.proportion.include" />
                    <CSign />
                </label>
                <label for="c-slash-sign-input" :class="{ 'opacity-55': !(showSign && isCSlashSign) }">
                    <input type="checkbox" id="c-slash-sign-input" v-model="isCSlashSign"
                        :disabled="!getDoc().docSettings.proportion.include" />
                    <CSlashSign />
                </label>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import CSign from '@/components/svg/CSign.vue';
import CSlashSign from '@/components/svg/CSlashSign.vue';
import RezTabFile from '@/store/modules/RezTabFile';
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
function getDoc() { return store.state.currentDoc as RezTabFile; }
const isCSign = ref(getDoc().docSettings.proportion.sign == 'C' && !getDoc().docSettings.proportion.slash);
const isCSlashSign = ref(getDoc().docSettings.proportion.slash == 1);
const showSign = ref(!!getDoc().docSettings.proportion.sign);
const getNum = () => getDoc().docSettings.proportion.num;
const setNum = (n: number) => getDoc().docSettings.proportion.num = n
const getNumbase = () => getDoc().docSettings.proportion.numbase;
const setNumbase = (n: number) => getDoc().docSettings.proportion.numbase = n
const num = ref(getNum())
const numbase = ref(getNumbase())
watch(num, (val) => {
    setNum(val);
    updateSignSituation()

});
watch(numbase, (val) => {
    setNumbase(val);
    updateSignSituation()

})
watch(isCSign, val => {
    if (val == true) {
        showSign.value = true;
        getDoc().docSettings.proportion.sign = "C"
        delete getDoc().docSettings.proportion.slash
        isCSlashSign.value = false;

        num.value = 4;
        numbase.value = 4
    }
})
watch(isCSlashSign, val => {
    if (val == true) {
        showSign.value = true;
        isCSign.value = false;
        getDoc().docSettings.proportion.sign = "C"
        getDoc().docSettings.proportion.slash = 1
        num.value = 2;
        numbase.value = 2
    }
})
watch(showSign, val => {
    if (val == false) {
        delete getDoc().docSettings.proportion.sign
        delete getDoc().docSettings.proportion.slash
    }
})

/**on Num And Numbase Updated */
function updateSignSituation() {
    if (!(num.value == 2 && numbase.value == 2)) isCSlashSign.value = false
    if (!(num.value == 4 && numbase.value == 4)) isCSign.value = false
    if (!isCSign.value && !isCSlashSign.value) showSign.value = false
}
</script>

<style scoped>
.sign-checkboxs label {
    @apply w-8 inline-block cursor-pointer
}

.sign-checkboxs input[type=checkbox] {
    @apply hidden absolute;
}

.sign-checkboxs {
    @apply items-center flex gap-x-3
}
</style>