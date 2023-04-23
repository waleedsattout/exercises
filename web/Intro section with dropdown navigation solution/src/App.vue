<script setup>
import navHead from './components/navHead.vue'
import footerBrand from './components/footerBrand.vue'

let isMobile = window.isMobile
let pad, mar, btnMar, style;
if (isMobile()) {
  pad = ''
  mar = 'my-4'
  style = "margin: 0 25%;width: 50%;"
} else {
  pad = 'p-14';
  mar = ''
  style = 'min-width: 130px;width: 25%;'
}
</script>

<template>
  <navHead />
  <div class="hero justify-center">
    <div class="w-auto sm:w-1/2 pb-0 flex flex-col justify-evenly gap-12" :class="pad">
      <p class="head" :class="mar">Make <br v-if="!isMobile()"> remote work</p>
      <p class="ctm-font">Get your team in sync, no matter your location. Streamline processes, create team rituals
        and watch productivity soar.</p>
      <button class="btn" :style="style">Learn more</button>
      <footerBrand />
    </div>
    <div v-if="!isMobile()">
      <img src="./images/image-hero-desktop.png" alt="" class="ml-auto">
    </div>
    <button v-else>
      <img src="./images/image-hero-mobile.png" alt="">
    </button>
  </div>
</template>
