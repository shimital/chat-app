<template>
    <div>
        <ul class="ca-list">
            <li 
                v-for="user in users"
                v-bind:key="user.name"
            >
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class UsersPane extends Vue {

    get users () {
        return this.$store.state.currentRoom.users;
    }

}

</script>