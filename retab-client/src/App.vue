<template>
  <div>
    <ColdStartLoader v-if="!isServerReady && !hasError" />
    
    <div v-else-if="hasError" class="p-8 text-center text-red-600">
      Oups, le serveur met trop de temps à répondre. Veuillez recharger la page.
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import ColdStartLoader from './components/ColdStartLoader.vue';

const store = useStore();
const isServerReady = ref(false);
const hasError = ref(false);

onMounted(async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/retab/health`, { timeout: 60000 });
    
    isServerReady.value = true;
    
  } catch (error) {
    console.error("Erreur de connexion au serveur :", error);
    hasError.value = true;
  }
});
</script>
