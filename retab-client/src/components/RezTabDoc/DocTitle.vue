<template>
    <div class="flex justify-center pb-5">

        <div class="flex flex-col items-center">
            <h2 class="va-h3">
                {{ doc.getTitle() }}
            </h2>
                <h3 class="va-h6">
                    {{ doc.getAltTitle() }}
                </h3>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { useDoc } from '@/composables/useDoc';

const doc = useDoc();

</script>