<template>
    <div class="bolden" @mouseover="changeArrow()" @click="isUp = !isUp">
        {{ text }}
        <span drop class="inline-block slide-enter-active" v-if="hasDropDown && isUp">
            <iconArrowUp />
        </span>
        <span class="inline-block" v-if="hasDropDown && !isUp">
            <iconArrowDown />
        </span>
        <transition name="slide" mode="in-out">
            <slot v-if="hasDropDown && isUp"></slot>
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import iconArrowUp from './../images/icon-arrow-up.vue'
import iconArrowDown from './../images/icon-arrow-down.vue'

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    hasDropDown: {
        type: Boolean,
        required: true
    }
})

var isUp = ref(false)
let isMobile = window.isMobile

function changeArrow() {
    let over = (e) => {
        if (e.target.classList.contains('ls') || e.target.classList.contains('drop-menu') || e.target.parentElement.classList.contains('drop-menu') || e.target.classList.contains('bolden') || e.target.hasAttribute('drop') || e.target.hasAttribute('item') || e.target.parentElement.hasAttribute('item')) {
            isUp.value = true;
        } else {
            isUp.value = false;
            document.removeEventListener('mouseover', over)
        }
    }
    if (!isMobile())
        document.addEventListener('mouseover', over);
}
</script>
