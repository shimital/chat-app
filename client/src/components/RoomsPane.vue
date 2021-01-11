<template>
    <div>
        <ul class="ca-list">
            <li 
                v-for="room in rooms"
                v-bind:key="room.name"
                v-on:click="roomSelected(room.name)"
                :class="{'ca-current-room': room.name === currentRoom}"
            >
                {{ room.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class RoomsPane extends Vue {

    mounted(): void {
        this.$store.dispatch('GET_ROOMS');
    }

    get rooms () {
        return this.$store.state.rooms;
    }

    get currentRoom() {
        return this.$store.state.currentRoom.name;
    }

    roomSelected(roomName: string): void {
        this.$store.dispatch('ROOM_SELECTED', roomName);
    }
}

</script>

<style scoped>

    .ca-current-room {
        background: red;
        pointer-events: none;
    }

</style>