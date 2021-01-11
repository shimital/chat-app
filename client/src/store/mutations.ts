import { MutationMethod } from 'vuex';

export const SET_ROOMS: MutationMethod = (state, rooms) => {
    state.rooms = rooms;
};

export const SET_CURRENT_ROOM: MutationMethod = (state, currentRoom) => {
    state.currentRoom = currentRoom;
};

export const SET_USERNAME: MutationMethod = (state, payload) => {
    state.username = payload.username;
    state.socketId = payload.socketId;
};

export const ADD_MESSAGE: MutationMethod = (state, payload) => {
    state.currentRoom.messages = [ ...state.currentRoom.messages, payload ];
};

export const ADD_USER: MutationMethod = (state, userPayload) => {
    const notificationMessage = `${ userPayload.name } entered the room!`;

    state.currentRoom.messages = [ ...state.currentRoom.messages, {
        body: notificationMessage,
        type: 'user-notification'
    } ];

    state.currentRoom.users = [ ...state.currentRoom.users, userPayload ];
};

export const REMOVE_USER: MutationMethod = (state, userPayload) => {
    const notificationMessage = `${ userPayload.name } left the room!`;

    state.currentRoom.messages = [ ...state.currentRoom.messages, {
        body: notificationMessage,
        type: 'user-notification'
    } ];

    state.currentRoom.users =
        state.currentRoom.users.filter((user: any) => user.name !== userPayload.name);
};