<template>

    <div>
        <div class="flex justify-between px-16 w-full">
            <va-input v-model="filterStr" label="filter" @update:model-value="getSavedDocsList" inner-label></va-input>
            <div>
                <va-button color="success" @click="newDoc">
                    <va-icon name="add" />
                </va-button>
            </div>
        </div>
        <va-data-table :items="list" selectable :columns="[
            { key: 'title', label: 'Title', },
            { key: 'altTitle', label: 'Alt. Title', },
            { key: 'filename', label: 'Filename', },
            { key: 'createdAt', label: 'Created At', },
            { key: 'lastModifiedAt', label: 'Last Modified At', },
            { key: '', label: 'get Mei', },
            { key: 'edit', label: 'edit', },
            { key: 'remove', label: 'remove', },

        ]" hoverable :clickable="true" striped @row:click="({ item }) => rowClick(item)"
         @row:contextmenu="(vaEvent) => toggleSelectRow(vaEvent)"
        v-model="selectedItems">

            <template #cell(title)="{ rowData }">
                <router-link class="w-full h-full block " :to="'/doc/' + rowData.id">
                    {{ rowData.title }}
                </router-link>
            </template>
            <template #cell(edit)="{ rowData }">
                <router-link :to="'/doc/' + rowData.id">
                    <va-icon role="button" name="edit" color="info"></va-icon>
                </router-link>
            </template>
            <template #cell(createdAt)={value} >
                {{ new Date(value).toLocaleString() }}
            </template>
            <template #cell(lastModifiedAt)={value} >
                {{ new Date(value).toLocaleString() }}
            </template>
            <template #cell(remove)="{ rowData }">
                <button @click="remove(rowData.id)">
                    <va-icon role="button" name="delete" color="danger"></va-icon>
                </button>
            </template>

        </va-data-table>
        <div class="flex justify-center py-3 gap-x-3">
            <va-button @click="removeSelected" color="danger" :disabled="!selectedItems.length"
            icon="delete"
            >Delete Selected</va-button>
            <va-pagination :pages="totalPages" v-model="currentPage" @update:model-value="getSavedDocsList" />


        </div>
    </div>
</template>

<script setup lang="ts">
import RezTabFile from '@/store/modules/RezTabFile';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useModal, useToast } from 'vuestic-ui/web-components';
import { useStore } from 'vuex';

const store = useStore();
const list = ref<any[]>([])
const selectedItems = ref<typeof list.value>([])
async function getSavedDocsList() {
    const resData = (await axios.get(store.state.apiUrl + '/retab/doc/get-all-saved', {
        params: {
            page: currentPage.value,
            size: perPage.value,
            search: filterStr.value
        }
    })).data
    list.value = resData.docsList
    totalPages.value = resData.totalPages

}

function rowClick(item: typeof list.value[0]) {
    router.push('/doc/' + item.id)
   
}
async function removeSelected()  {
    
    modal.init({
        message: "Are you sure?",
        okText: 'Yes',
        cancelText: 'No',
        "child:okButton": {
            textColor: 'primary',
        },
        onOk: async () => {
            for (const item of selectedItems.value) {
                const result = await axios.delete(store.state.apiUrl + '/retab/doc/' + item.id);
                toast.init({ message:'"' + (item.title || item.altTitle || '' )+  '" Removed successfully.', color: 'success', position: 'bottom-right' });
            }
            selectedItems.value = [];
            await getSavedDocsList();

        }
    })
}
const currentPage = ref(1)
const perPage = ref(20);
const totalPages = ref(20);

function toggleSelectRow(vaEvent: any) {
    vaEvent.event?.preventDefault();
    
    
    const index = selectedItems.value.indexOf(vaEvent?.item)
    
    if (index > -1) selectedItems.value.splice(index, 1)
    else selectedItems.value.push(vaEvent.item)
}

const filterStr = ref("")
const modal = useModal();
const toast = useToast();
async function remove(id: number, ask = true) {
    modal.init({
        message: "Are you sure?",
        okText: 'Yes',
        cancelText: 'No',
        "child:okButton": {
            textColor: 'primary',
        },
        onOk: async () => {
            const result = await axios.delete(store.state.apiUrl + '/retab/doc/' + id);
            toast.init({ message: 'Removed successfully.', color: 'success', position: 'bottom-right' });
            await getSavedDocsList()
        }
    })
}


const router = useRouter();
onMounted(async () => await getSavedDocsList())
function enterModifyPage(id: any, event: Event) {
    if (['I', 'BUTTON'].includes((event.target as HTMLElement).tagName)) return;
    else router.push('/doc/' + id)
}
function newDoc() {
    router.push('/doc/' + 'new')
}
</script>