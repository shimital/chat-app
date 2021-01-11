<template>
    <div class="ca-message">
        <div v-if="isHeader" class="ca-message-header">
            {{ header }}
        </div>
        <div class="ca-message-body">
            <span>{{ body }}</span>
            <span> {{ timestamp }} </span>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class MessagesPaneMessage extends Vue {

    // TODO: this component is used by messages pane
    // it should get all its props from top

    @Prop(String) body!: string;
    // TODO:[notification, message] consider enum, notification can be in the middle
    @Prop(String) type!: string;
    @Prop(String) timestamp!: string; // consider format
    @Prop(String) header!: string; // contains the username, available when type = message

    get isHeader() {
        return this.type === 'message';
    }

}

</script>

<style scoped>

    .ca-message {
        max-width: 60%;
        border: 1px black solid;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 5px;
    }

</style>