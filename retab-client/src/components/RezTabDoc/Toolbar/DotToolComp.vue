<template>
    <div class="w-4 h-4 flex justify-center items-end">
        <svg v-if="dots >= 1" :x="`${dotXOffset}px`" y="80%" id="Layer_1" xmlns="http://www.w3.org/2000/svg" height="5"
            width="5" version="1.1" viewBox="0 0 5 5">
            <circle cx="2.72" cy="2.72" r="1.6" style="fill: #231f20; stroke: #231f20; stroke-miterlimit: 10;" />
        </svg>
        <svg v-if="dots >= 2" :x="`${dotXOffset + 5}px`" y="80%" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            height="5" width="5" version="1.1" viewBox="0 0 5 5">
            <circle cx="2.72" cy="2.72" r="1.6" style="fill: #231f20; stroke: #231f20; stroke-miterlimit: 10;" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
const dots = 1
const dotXOffset = -5
</script>