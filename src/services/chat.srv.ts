import messageQueue from './message-queue';
import dao from './dao';
import { ProcessedMessageNotificationHandler } from '../app';
import { IRoom, IUser } from '../models/chat.model';

export class ChatSrv {

    constructor (
        private readonly messageQueue: IMessageQueue,
        private readonly dao: IDao
    ) { }

    subscribe (callback: ProcessedMessageNotificationHandler): void {
        const wrapperCallback = (room: string, extendedMessage: string) => {
            const messageParts = extendedMessage.split(' ');
            const username = messageParts[ 0 ];
            const message = messageParts.slice(1).join(' ');
            callback({ username, body: message, room });
        };

        this.messageQueue.init(wrapperCallback);
        this.subscribeToExistingRooms();
    }

    postMessageToRoom (room: string, username: string, message: string): Promise<void> {
        const extendedMessage = `${ username } ${ message }`;
        return this.messageQueue.publish(room, extendedMessage);
    }

    addUserToRoom (roomName: string, userName: string): Promise<number> {
        return this.dao.addUserToRoom(roomName, userName);
    }

    removeUserFromRoom (roomName: string, userName: string): Promise<number> {
        return this.dao.removeUserFromRoom(roomName, userName);
    }

    createRoom (roomName: string, creator: string): Promise<string> {
        this.messageQueue.subscribe(roomName);

        return this.dao.createRoom(roomName, creator);
    }

    getRooms (): Promise<IRoom[]> {
        return this.dao.getRooms();
    }

    getUsersInRoom (roomName: string): Promise<IUser[]> {
        return this.dao.getUsersInRoom(roomName);
    }

    private subscribeToExistingRooms (): void {
        this.getRooms()
            .then((rooms: IRoom[]) => {
                rooms.forEach((room: IRoom) => {
                    this.messageQueue.subscribe(room.name);
                });
            });
    }

}

export default new ChatSrv(messageQueue, dao);

export interface IMessageQueue {
    publish: (channel: string, message: string) => Promise<void>;
    init: (callback: MessageNotificationHandler) => void;
    subscribe: (channel: string) => void;
}

export interface IDao {
    getUsersInRoom: (roomName: string) => Promise<IUser[]>;
    createRoom: (roomName: string, creator: string) => Promise<string>;
    getRooms: () => Promise<IRoom[]>;
    addUserToRoom: (roomName: string, userName: string) => Promise<number>;
    removeUserFromRoom: (roomName: string, userName: string) => Promise<number>;
}

export type MessageNotificationHandler = (room: string, message: string) => void;


