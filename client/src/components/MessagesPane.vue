<template>
    <div class="ca-messages-pane">
        <div class="ca-messages-container">
            <MessagesPaneMessage 
                v-for="(message, index) in messages"
                :key="index"
                :body="message.body"
                :type="message.type"
                :header="message.username"
            />
        </div>
        
        <div v-if="isRoomSelected" class="ca-input-container">
            <input class="ca-input" 
                type="text" 
                v-model="message" 
                v-on:keyup.enter="publishMessage"
                placeholder="enter message!"
            >
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import MessagesPaneMessage from './MessagesPaneMessage.vue';

@Component({
    components: { 
        MessagesPaneMessage
    }
})
export default class MessagesPane extends Vue {

    get messages() {
        return this.$store.state.currentRoom.messages;
    }

    get isRoomSelected() {
        return !!this.$store.state.currentRoom.name;
    }

    message = '';

    publishMessage(): void {
        if (!this.message) {
            return;
        }

        this.$store.dispatch('PUBLISH_MESSAGE', this.message);
        this.message = ''; // TODO: consider maybe other timings to reset the input
    }

}

</script>

<style scoped>

    .ca-messages-pane {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .ca-messages-container {
        padding: 20px;
        height: 90%;
    }

    .ca-input-container {
        height: 10%;
        text-align: center;
    }

    .ca-input {
        width: 80%;
        height: 25px;
    }

</style>