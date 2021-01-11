<template>
    <div class="app-chat-container">
        <div class="app-chat-left-column">
            <div class="app-chat-left-pane">
                <RoomsPane/>
            </div>
            <hr>
            <div class="app-chat-left-pane">
                <UsersPane/>
            </div>
        </div>
        <div class="app-chat-right-column">
            <MessagesPane/>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import UsersPane from '../components/UsersPane.vue';
import MessagesPane from '../components/MessagesPane.vue';
import RoomsPane from '../components/RoomsPane.vue';

@Component({
    components: { 
        UsersPane,
        RoomsPane,
        MessagesPane
    }
})
export default class ChatDisplay extends Vue {
}

</script>

<style scoped>

.app-chat-container {
    display: flex;
    flex-direction: row;
    border: 1px black solid;
    width: 80%;
    height: 700px;
    margin: 30px auto;
}

.app-chat-left-column {
    width: 33%;
    height: 100%;
    border-right: 1px black solid;
}

.app-chat-right-column {
    width: 66%;
}

.app-chat-left-pane {
    height: 50%;
}

</style>