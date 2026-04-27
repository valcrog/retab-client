<template>
  <div class="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center p-4">
    <div class="relative w-24 h-24 mb-8">
      <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Réveil du serveur en cours...
    </h2>
    
    <p class="text-gray-600 text-center max-w-md">
      Le serveur s'endort après une période d'inactivité. <br/><br/>
      <strong>Le démarrage peut prendre jusqu'à 45 secondes.</strong> Merci de votre patience 🎵 !
    </p>

    <div class="w-full max-w-xs mt-8 bg-gray-200 rounded-full h-2">
      <div class="bg-blue-500 h-2 rounded-full transition-all duration-1000" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(() => {
    if (progress.value < 95) {
      progress.value += 2;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
