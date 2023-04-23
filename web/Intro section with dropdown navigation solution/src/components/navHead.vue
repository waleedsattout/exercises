<template>
    <div class="flex justify-between mb-12 text-sm">
        <div class="ls" :style="style">
            <img src="../images/logo.svg" alt="" class="mr-5">
            <div class="ls" v-if="!isMobile()">
                <nav-item :has-drop-down="true" :text="'Features'">
                    <div class='drop-menu'>
                        <div item>
                            <icon-todo />
                            <div>
                                Todo List
                            </div>
                        </div>
                        <div item>
                            <calender />
                            <div>
                                Calender
                            </div>
                        </div>
                        <div item>
                            <reminders />
                            <div>
                                Reminders
                            </div>
                        </div>
                        <div item>
                            <planning />
                            <div>
                                Planning
                            </div>
                        </div>
                    </div>
                </nav-item>
                <nav-item :has-drop-down="true" :text="'Company'">
                    <div class='drop-menu'>
                        <div>History</div>
                        <div>Our Team</div>
                        <div>Blog</div>
                    </div>
                </nav-item>
                <nav-item :has-drop-down="false" :text="'Careers'" />
                <nav-item :has-drop-down="false" :text="'About'" />
            </div>
            <div v-else>
                <icon-menu v-if="!expanded" @click="expanded = !expanded" />
                <div class="dimming" v-if="expanded"></div>
                <div class="drower" v-if="expanded">
                    <icon-close-menu class="ml-auto mb-4" v-if="expanded" @click="expanded = !expanded" />

                    <nav-item :has-drop-down="true" :text="'Features'">
                        <div class='drop-menu'>
                            <div item>
                                <icon-todo />
                                <div>
                                    Todo List
                                </div>
                            </div>
                            <div item>
                                <calender />
                                <div>
                                    Calender
                                </div>
                            </div>
                            <div item>
                                <reminders />
                                <div>
                                    Reminders
                                </div>
                            </div>
                            <div item>
                                <planning />
                                <div>
                                    Planning
                                </div>
                            </div>
                        </div>
                    </nav-item>
                    <nav-item :has-drop-down="true" :text="'Company'">
                        <div class='drop-menu'>
                            <div>History</div>
                            <div>Our Team</div>
                            <div>Blog</div>
                        </div>
                    </nav-item>
                    <nav-item :has-drop-down="false" :text="'Careers'" />
                    <nav-item :has-drop-down="false" :text="'About'" />
                </div>
            </div>
        </div>
        <div class="ls" v-if="!isMobile()">
            <div class="register bolden"> Register </div>
            <div class="bolden"> Login </div>
        </div>
    </div>
</template>

<script setup>
import navItem from './navItem.vue'
import iconTodo from '../images/icon-todo.vue'
import calender from '../images/icon-calendar.vue'
import reminders from '../images/icon-reminders.vue'
import planning from '../images/icon-planning.vue'
import iconMenu from '../images/icon-menu.vue'
import iconCloseMenu from '../images/icon-close-menu.vue'
import { ref } from 'vue';

let expanded = ref(false)

let isMobile = window.isMobile

let style = isMobile() ? `width: 100%;justify-content: space-between;` : ''
</script>
