<template>
    <div class="ca-form-container">
        <!-- TODO: consider using here <form v-on:submit.prevent></form> -->
        <form 
            @submit="submitUsername"
            novalidate="true"
        >
            <div>
                <input type="text" v-model="username" placeholder="enter username">
            </div>
            <div>
                <input type="submit" value="lets go!">
            </div>
        </form>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class UserEntrance extends Vue {

    username = '';
    errors: string[] = [];

    submitUsername(event: Event): void {
        // we want this function to invoke route transition into the 
        // chat-display, with the username as a parameter.
        // 
        if (!this.username) {
            this.errors.push('username must not be empty');
        }

        if (!this.isStartWithLetter(this.username)) { 
            this.errors.push('username must start with a letter'); 
        }

        if (!this.errors.length) {
            // invoke route transition, with the username
            this.$store.dispatch('USER_NAME_CREATED', this.username)
                .then(() => {
                    this.$router.push({path: `chat/${this.username}`});
                });
        }

        event.preventDefault();
    }

    private isStartWithLetter(test: string): boolean {
        return !!test[0].match(/[a-zA-Z]/);
    }

}

</script>

<style scoped>

    .ca-form-container {
        width: 30%;
        height: 200px;  
        margin: 40vh auto;
    }

</style>