import { ActionMethod } from 'vuex';
import axios from 'axios';
import io from 'socket.io-client';
import store from './index';

const socket = io();
let socketId: string;

socket.on('connect', () => {
    socketId = socket.id;
});

export const GET_ROOMS: ActionMethod = ({ commit }) => {
    return axios.get('/rooms')
        .then((response) => {
            commit('SET_ROOMS', response.data.rooms);
        });
};

export const ROOM_SELECTED: ActionMethod = async (context, roomName: string) => {
    try {
        if (context.state.currentRoom.name) {
            await axios.delete(`/rooms/${ context.state.currentRoom.name }/users/${ context.state.username }`);
        }

        await axios.post(`/rooms/${ roomName }/users`, {
            username: context.state.username
        });

        const response = await axios.get(`/rooms/${ roomName }/users`);

        const payload = {
            users: response.data.users,
            name: roomName,
            messages: []
        };

        context.commit('SET_CURRENT_ROOM', payload);
    } catch (error) {
        console.error('problem in moving user between rooms');
        throw new Error(error);
    }
};

export const USER_NAME_CREATED: ActionMethod = (context, username: string) => {
    return new Promise((resolve, reject) => {
        const payload = {
            username,
            socketId
        };

        axios.post('/users', payload)
            .then(() => {
                context.commit('SET_USERNAME', payload);
                resolve();
            })
            .catch((error: Error) => {
                reject(error);
                console.log('user could not be stored in the server');
            });
    });
};

// TODO: consider adding type to 'message' argument
export const PUBLISH_MESSAGE: ActionMethod = (context, message) => {
    const currentRoomName: string = context.state.currentRoom.name;

    return axios.post(`/rooms/${ currentRoomName }/messages`, {
        body: message,
        username: context.state.username
    });
};

export const INCOMING_MESSAGE: ActionMethod = (context, message) => {
    return new Promise((resolve) => {
        context.commit('ADD_MESSAGE', {
            username: message.username,
            body: message.body,
            type: 'message'
            // TODO: remember the timestamp
        });

        resolve();
    });
};

export const USER_ENTERED: ActionMethod = (context, message) => {
    return new Promise((resolve) => {
        context.commit('ADD_USER', message);
        resolve();
    });
};

export const USER_LEAVE: ActionMethod = (context, message) => {
    return new Promise((resolve) => {
        context.commit('REMOVE_USER', message);
        resolve();
    });
};

const registerSocketEvents = (): void => {
    socket.on('message', (message: any) => {
        store.dispatch('INCOMING_MESSAGE', message);
    });

    socket.on('user-enter', (message: any) => {
        store.dispatch('USER_ENTERED', message);
    });

    socket.on('user-leave', (message: any) => {
        store.dispatch('USER_LEAVE', message);
    });
};

registerSocketEvents();
