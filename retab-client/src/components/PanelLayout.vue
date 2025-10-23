<template>
  <div>
    <va-layout>
      <template #top>
        <VaNavbar color="primary" class="items-center">
          <template #left>
            <VaNavbarItem>
              <Logo />
              <!-- <span class="font-bold text-2xl">
                reTab
              </span> -->
            </VaNavbarItem>
          </template>
          <template #center>
            <router-link to="/doc">
              <VaNavbarItem>
                {{ store.state.currentUser?.name }}
                Docs
              </VaNavbarItem>

            </router-link>
          </template>
          <template #right>
            <div class="flex items-baseline gap-x-0">
              <DevTest>
                <VaNavbarItem>
                  <router-link :to="'/dev-test'">
                    <CodeBracketSquareIcon class="fill-white w-8"/>
                  </router-link>
                </VaNavbarItem>
                
              </DevTest>
              <VaNavbarItem>
                <router-link :to="'/import'">
                  <DocumentArrowUpIcon class="fill-white w-8"/>

                </router-link>
              </VaNavbarItem>
              <VaNavbarItem class="self-center">
                <va-button class="p-0 flex justify-center w-10" @click="save">
                  <span class="w-full flex justify-center">
                    <va-inner-loading color="white" loading v-if="isSaving" />
                    <va-icon name="save" size="1.8rem" v-else />

                  </span>
                </va-button>
              </VaNavbarItem>
              <VaNavbarItem>
                <va-button @click="() => useDoc().generateAndDownloadMei()">
                  <div class="cursor-pointer">
                    <img src="/logos/mei-logo-simple-dark.png" class="w-14" alt="MEI LOGO">
                  </div>
                </va-button>
              </VaNavbarItem>
              <VaNavbarItem>
                <va-button>
                  <DocPreferences />
                </va-button>
              </VaNavbarItem>
              <VaNavbarItem>
                <va-button>
                  <ShortkeysGuid />
                </va-button>
              </VaNavbarItem>
              <VaNavbarItem class="self-center">
                <router-link class="h-full" to="/doc/new" target="_blank">
                  <va-button color="info">
                    <va-icon name="add">
                    </va-icon>
                  </va-button>
                </router-link>
              </VaNavbarItem>
   

              <!-- <VaNavbarItem>
                <ConnectionChecker class="mx-2" />
              </VaNavbarItem> -->
            </div>

          </template>
        </VaNavbar>

      </template>
    </va-layout>
  </div>
  <div class="p-5">
    <slot />
  </div>
</template>

<script setup lang="ts">

import ConnectionChecker from '@/components/ConnectionChecker.vue';
import DocPreferences from '@/components/RezTabDoc/DocPreferences/index.vue';
import ShortkeysGuid from './ShortkeysGuid.vue';
import { useStore } from 'vuex';
import Logo from './utils/Logo.vue';
import { useDoc } from '@/composables/useDoc';
import RezTabFile from '@/store/modules/RezTabFile';
import { useToast } from 'vuestic-ui/web-components';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { DocumentArrowUpIcon, CodeBracketSquareIcon} from '@heroicons/vue/24/solid';
import DevTest from './utils/DevTest.vue';
const store = useStore();
const isSaving = ref(false)
const toast = useToast();
const router = useRouter();
const saveButtonIconName = ref('save')
async function save() {
  isSaving.value = true
  const doc = useDoc();
  let wannaRefreshThepage = !doc.id;
  const result = await doc.save();
  toast.init({
    color: 'success', message: 'Saved Successfully.',
    position: 'bottom-right'
  })



  doc.id = result.id
  doc.unfreeze();
  isSaving.value = false
  if (wannaRefreshThepage) {
    return router.push({ path: '/doc/' + doc.id }), 1000
  } else return doc.unfreeze();

}
</script>