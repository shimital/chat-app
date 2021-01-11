<template>
    <div class="main">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {

}

</script>

<style>

    

    .ca-list {
        list-style: none;
    }

</style>
