<template>
    <div class="flex items-end cursor-pointer focus:outline-none" focusable :class="{'opacity-25': !showTabDurSym }"
    @click="$emit('toggleShowTabDurSym')"  
    @keyup="keyup" tabindex="0"
     >
        <div >

            <svg class="h-fit" width="50px" height="75px" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mei="http://www.music-encoding.org/ns/mei"
                overflow="visible">
                <desc>Engraved by Verovio 4.3.1-3b8cc17</desc>
                <defs>
                    <symbol id="E4C0-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M0 0c0 0 40 320 300 320s300 -320 300 -320h-32s-38 227 -268 227s-268 -227 -268 -227h-32zM355 52c0 -30 -25 -55 -55 -55s-55 25 -55 55s25 55 55 55s55 -25 55 -55z">
                        </path>
                    </symbol>
                    <symbol id="EBE3-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M166 206c0 -22 -24 -41 -42 -53c25 -3 37 -12 49 -24c10 -10 16 -20 16 -34c0 -18 -8 -39 -26 -57c-5 -5 -11 -10 -18 -15c-22 -14 -27 -15 -44 -20c-18 -5 -37 -6 -53 -6c-13 0 -22 2 -27 7c-2 2 -4 6 -4 9c0 9 8 12 18 12c5 0 12 -1 20 -4c5 -2 7 -3 9 -3h3 c6 0 19 6 28 11c1 1 2 1 3 1c5 2 5 2 10 6s9 8 13 12c13 13 17 23 17 37c0 25 -19 41 -43 41c-7 0 -21 -3 -26 -4l-15 -4h-1c-5 0 -10 5 -10 10c0 2 1 4 2 5c3 3 10 6 19 10l15 7c13 8 21 14 26 19c9 9 10 15 11 27v5c0 7 -2 12 -6 15c-8 6 -12 9 -23 9 c-13 0 -17 -1 -34 -10l-6 -3c-5 -4 -12 -6 -15 -6c-2 0 -8 2 -8 6c0 7 9 15 15 19c15 11 32 18 53 18c15 0 37 -4 49 -10c11 -6 25 -18 25 -33z">
                        </path>
                    </symbol>
                    <symbol id="EBE4-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M193 37c2 -23 9 -26 15 -26c3 0 6 1 8 1c3 0 5 -2 5 -7c0 -8 -5 -8 -9 -8c-16 0 -31 2 -43 2c-5 0 -12 -1 -21 -1h-10c-3 0 -5 -1 -8 -1h-5c-7 0 -7 7 -7 7c0 10 29 10 29 19v37l-106 -1h-8c-8 0 -17 2 -17 10c0 6 11 17 11 17l142 156c4 4 8 7 14 7c7 0 15 -2 15 -10v-1 c0 -2 0 -7 -4 -11l-142 -142s-1 -2 -2 -3h76c1 0 2 1 3 1h16c1 0 2 1 2 3l1 70c0 12 11 15 24 15c7 0 20 -3 20 -12v-75c0 -1 0 -1 3 -1c0 0 26 -2 26 -10c0 -7 0 -15 -17 -15c-2 0 -4 1 -5 1c-5 0 -6 -1 -6 -6v-16z">
                        </path>
                    </symbol>
                    <symbol id="EBE5-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M30 -3c-6 0 -12 3 -12 9c0 1 1 2 1 2c2 2 8 4 21 8c17 5 27 9 28 9c19 9 29 17 40 29s16 28 16 44c0 19 -6 33 -17 43c-10 10 -21 17 -43 23c-5 1 -12 3 -20 5c-12 3 -20 6 -24 10c-2 2 -3 4 -3 6c0 3 2 8 6 17c6 15 9 24 10 28c2 6 4 11 8 12c3 1 7 2 12 2c1 0 4 0 10 1 c9 1 34 4 47 6c10 2 20 3 29 3c6 0 9 -6 9 -11c0 -13 -6 -27 -21 -27c-3 0 -5 -1 -8 -1c-18 -2 -36 -3 -54 -5c-8 -1 -10 -1 -13 -2l-4 -2s-1 -4 -1 -7c0 -1 3 -2 11 -3c7 -1 15 -2 21 -4c25 -7 47 -17 62 -29c16 -14 31 -33 31 -55c0 -25 -10 -46 -28 -64 c-17 -17 -40 -30 -67 -40c-18 -6 -34 -7 -47 -7z">
                        </path>
                    </symbol>
                    <symbol id="EBA7-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M0 770c0 5 6 4 51 19c7 2 12 2 14 2c15 0 16 -15 16 -35v-7c0 -94 -4 -76 -5 -259v-43c0 -99 2 -259 2 -292c0 -19 1 -33 1 -41v-60c1 -23 4 -41 9 -54h-60c-8 157 -9 514 -24 741c-1 15 -4 25 -4 29z">
                        </path>
                    </symbol>
                    <symbol id="EBA8-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M9 771c0 16 0 24 14 24c71 -6 175 -22 208 -28c85 -16 143 -34 173 -56c-12 -27 -21 -42 -25 -42c-1 0 -1 0 -2 1l-104 34c-67 20 -123 30 -165 30c-13 0 -25 -1 -36 -3c-3 -38 -5 -105 -7 -202c-2 -104 -9 -378 -20 -529l-46 1z">
                        </path>
                    </symbol>
                    <symbol id="EBAA-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M0 0l8 740c0 2 1 12 3 32c0 6 4 9 11 9c3 0 12 -1 27 -3c160 -22 267 -54 321 -95c8 -21 13 -44 13 -68c0 -22 -6 -39 -15 -50c0 0 -27 11 -27 16c3 15 5 28 5 37c0 21 -9 38 -30 50c-24 15 -69 29 -133 44l-117 12l3 -88h12c35 0 90 -13 164 -39c81 -29 129 -54 142 -75 c3 -6 3 -13 3 -21c0 -12 -10 -66 -13 -66c-10 0 -30 5 -30 14v2c4 12 6 22 6 30c0 14 -5 24 -15 30c-53 24 -194 73 -257 73c-2 0 -6 0 -13 -1c-2 -1 -3 -4 -3 -9c2 -2 2 -8 2 -13v-49c0 -11 2 -20 0 -27c3 0 6 1 9 1c43 0 91 -11 151 -31l99 -34c44 -13 66 -34 66 -72 c0 -11 -3 -26 -6 -42c-2 -2 -4 -3 -6 -3c-4 0 -23 5 -26 5c1 8 4 23 4 29c0 14 -2 24 -8 27c-12 7 -46 18 -102 35c-68 20 -121 31 -159 31c-11 0 -23 -1 -29 -2c-5 -36 -4 -80 -6 -138c-3 -73 -8 -270 -10 -291h-44z">
                        </path>
                    </symbol>
                    <symbol id="EBA9-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M377 435c-10 0 -30 5 -30 14v2c4 12 6 22 6 30c0 14 -5 24 -15 30c-54 25 -196 73 -261 73c-2 0 -6 0 -13 -1c-2 -1 -5 -63 -9 -187c-5 -142 -8 -371 -11 -396h-44l8 740v36c0 6 3 9 8 9l35 -5l80 -9c94 -13 170 -44 239 -88c8 -21 13 -44 13 -68c0 -22 -6 -39 -15 -50 c0 0 -27 11 -27 16c3 15 5 28 5 37c0 21 -9 38 -30 50c-24 15 -69 29 -133 44l-117 12l3 -88h12c35 0 90 -13 164 -39c81 -29 129 -54 142 -75c3 -6 3 -13 3 -21c0 -12 -10 -66 -13 -66z">
                        </path>
                    </symbol>
                    <symbol id="EBAB-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M0 0l8 740v13s-1 23 -1 24c0 6 3 9 12 9s31 -3 63 -10l87 -17c73 -14 153 -38 200 -73c9 -21 14 -42 14 -63c0 -19 -6 -35 -15 -46c-5 3 -27 10 -27 16c0 10 4 20 4 27c0 22 -12 38 -34 50c-20 11 -62 20 -128 38l-117 16l1 -82h15c37 0 90 -13 160 -38 c80 -29 127 -55 139 -76c3 -6 4 -12 4 -19c0 -11 -13 -55 -14 -62c-8 2 -30 9 -30 16c0 13 2 29 5 38c0 8 -2 13 -7 17c-4 4 -13 9 -27 13c-54 24 -162 60 -229 60h-11c-6 0 -8 -1 -8 -7c0 -14 1 -38 1 -50c0 -10 0 -18 -2 -25h10c44 0 98 -11 160 -36l105 -43 c30 -11 45 -26 45 -51c0 -9 -4 -28 -11 -58h-1c-7 0 -25 9 -29 9c2 10 4 26 5 35c0 8 -2 13 -6 16c-15 9 -48 21 -99 39c-68 23 -120 34 -156 34c-11 0 -19 -1 -24 -2v-87c4 0 9 1 13 1c43 0 93 -10 151 -28l99 -33c44 -16 67 -40 67 -79v-3c0 -10 -4 -44 -9 -45 c-4 0 -28 9 -31 9c1 8 5 25 5 31c0 14 -2 23 -8 27c-13 8 -47 27 -102 43c-68 20 -121 24 -159 24c-8 0 -17 -1 -27 -3c-1 -21 -9 -129 -11 -166l-6 -144z">
                        </path>
                    </symbol>
                    <symbol id="EBAC-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M0 0l3 826v11c0 12 1 16 13 16c1 0 2 -1 3 -1c70 -8 138 -17 200 -34c66 -18 115 -40 148 -65c7 -18 11 -34 11 -48c0 -19 -5 -35 -15 -47c-5 2 -28 9 -28 16c0 19 6 32 6 36c0 16 -10 28 -31 37c-17 7 -61 18 -131 35l-115 11l-1 -64c4 0 8 1 12 1c36 0 91 -12 164 -36 c81 -27 128 -52 141 -73c3 -7 4 -14 4 -21c0 -8 -11 -65 -13 -65c-10 0 -30 5 -30 13v3c4 11 6 20 6 29c0 14 -5 25 -15 31c-59 26 -191 73 -260 73c-13 0 -14 1 -14 -8c0 -2 1 -7 2 -14c0 -6 -3 -14 -2 -19c2 -9 2 -18 -1 -29h9c44 0 96 -13 163 -40l117 -50 c27 -11 40 -25 40 -47c-2 -16 -5 -45 -8 -63c-2 -2 -4 -2 -6 -2c-9 0 -19 12 -26 12v40c-1 6 -3 11 -6 13c-19 11 -54 26 -105 44c-70 26 -124 39 -162 39c-9 0 -16 -1 -21 -2c-1 -7 0 -14 0 -20v-60h10c41 0 90 -10 150 -32l103 -37c45 -12 66 -35 66 -73 c0 -9 -2 -31 -5 -50c-2 -2 -4 -2 -6 -2c-4 0 -22 11 -27 11c1 9 3 26 3 32c0 14 -3 22 -8 25c-15 9 -52 21 -105 38c-68 22 -119 34 -158 34c-12 0 -20 -1 -24 -2l-1 -67c3 0 5 -7 7 -7c44 0 97 -1 158 -25l101 -40c44 -14 67 -41 67 -79c0 -10 -3 -24 -6 -42 c-3 -2 -5 -2 -7 -2c-4 0 -22 12 -25 12c1 8 3 16 3 22c0 14 -2 23 -8 26c-15 9 -50 21 -104 39c-71 23 -126 35 -163 35c-7 0 -16 4 -25 2c-1 -105 -2 -281 -4 -297z">
                        </path>
                    </symbol>
                    <symbol id="EBA6-ff46wk" :viewBox="viewBox" overflow="inherit">
                        <path transform="scale(1,-1)"
                            d="M-82 763c11 4 128 23 137 26c7 2 12 2 14 2c15 0 16 -15 16 -35v-7c0 -94 -4 -76 -5 -259v-43c0 -99 2 -259 2 -292c0 -19 1 -33 1 -41v-60c1 -23 4 -41 9 -54h-60c-8 155 -23 497 -23 725c0 1 0 6 -1 16c0 4 -2 5 -5 5c-10 -1 -25 -4 -46 -11c-22 -6 -35 -10 -37 -10 c-2 24 -2 37 -2 38z">
                        </path>
                    </symbol>
                </defs>
                <svg class="definition-scale" color="black" viewBox="0 0 500 500">
                    <g v-html="empty? dic.empty : dic[props.durNum]">

                    </g>

                </svg>
                <!-- dots -->
                <svg 
                v-if="dots>=1" 
               :x="`${dotXOffset}px`"
                y="80%"
                id="Layer_1" xmlns="http://www.w3.org/2000/svg"  height="5" width="5" version="1.1" viewBox="0 0 5 5">
                    <circle cx="2.72" cy="2.72" r="1.6" style="fill: #231f20; stroke: #231f20; stroke-miterlimit: 10;" />
                </svg>
                <svg 
                v-if="dots>=2" 
                      :x="`${dotXOffset + 5}px`"
                y="80%"
                
                id="Layer_1" xmlns="http://www.w3.org/2000/svg" height="5" width="5" version="1.1" viewBox="0 0 5 5">
                    <circle cx="2.72" cy="2.72" r="1.6" style="fill: #231f20; stroke: #231f20; stroke-miterlimit: 10;" />
                </svg>
            </svg>

        </div>
        <div class="">

        </div>

    </div>
</template>

<script setup lang="ts">
import { DurNum } from '@/store/modules/types';
import { defineProps } from 'vue'
const props = defineProps<{ durNum: 1 | 2 | 4 | 8 | 16 | 32 | 64, dots: number, showTabDurSym: boolean, empty?: boolean }>();
const viewBox = "0 0 1000 1000";
const y = 500;
const x = 25;
const dotXOffset = 10;
const height = 475
const width = 475;
const dic = {
    empty: `<use   x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    1: `<use xlink:href="#EBA6-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    2: `<use xlink:href="#EBA7-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    4: `<use xlink:href="#EBA8-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    8: `<use xlink:href="#EBA9-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    16: `<use xlink:href="#EBAA-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    32: `<use xlink:href="#EBAB-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
    64: `<use xlink:href="#EBAC-ff46wk"  x="${x}" y="${y}" height="${height}px" width="${width}px"></use>`,
}

const emits = defineEmits(['changeDuration', 'toggleShowTabDurSym'])
function keyup(event: KeyboardEvent) {

// change the durSym:
if (event.altKey) {
  event.preventDefault()
  const currentDuration = props.durNum;
  const newDuration: DurNum | undefined = ["ArrowUp", "ArrowRight"].includes(event.key) ? currentDuration / 2 as DurNum :
    ["ArrowDown", "ArrowLeft"].includes(event.key) ? currentDuration * 2 as DurNum
      : undefined;
  if (newDuration) emits('changeDuration' , newDuration)
  return;

}    }
</script>