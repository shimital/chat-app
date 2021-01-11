import { RedisClient } from 'redis';
import redis from 'redis';
import { IDao } from './chat.srv';
import { IRoom, IUser } from '../models/chat.model';

class Dao implements IDao {

    client: RedisClient;

    constructor () {
        this.initClient();
    }

    getUsersInRoom (room: string): Promise<IUser[]> {
        const roomKey = this.getRoomKey(room);

        return new Promise((resolve, reject) => {
            this.client.lrange(roomKey, 0, -1, (err, result) => {
                if (err) {
                    reject(new Error('users could not be fetched'));
                } else {
                    resolve(result.map(user => ({ name: user })));
                }
            });
        });

    };

    getRooms (): Promise<IRoom[]> {
        return new Promise((resolve, reject) => {
            this.client.keys('rooms:*', (err, result) => {
                if (err) {
                    reject(new Error('rooms could not be fetched'));
                } else {
                    const rooms: IRoom[] = result.map(keyRoom => {
                        return {
                            name: keyRoom.split(':')[ 1 ]
                        };
                    });

                    return resolve(rooms);
                }
            });
        });
    }

    createRoom (room: string, creator: string): Promise<string> {
        const roomKey = this.getRoomKey(room);

        return new Promise((resolve, reject) => {
            this.client.exists(roomKey, (err, exists) => {
                if (err) {
                    reject(new Error('error in creating room'));
                } else if (exists) {
                    resolve(null);
                } else {
                    this.client.lpush(roomKey, creator, (err, result) => {
                        if (err) {
                            reject(new Error('error in creating room'));
                        } else {
                            resolve(room);
                        }
                    });
                }
            });
        });
    };

    addUserToRoom (roomName: string, userName: string): Promise<number> {
        const roomKey = this.getRoomKey(roomName);

        return new Promise((resolve, reject) => {
            this.client.lpush(roomKey, userName, (err, result) => {
                if (err) {
                    reject(new Error('error in adding user to room'));
                } else {
                    resolve(result);
                }
            });
        });
    }

    removeUserFromRoom (roomName: string, userName: string): Promise<number> {
        const roomKey = this.getRoomKey(roomName);

        return new Promise((resolve, reject) => {
            this.client.lrem(roomKey, 0, userName, (err, result) => {
                if (err) {
                    reject(new Error('error in removing user from room'));
                } else {
                    resolve(result);
                }
            });
        });
    }

    private initClient (): void {
        this.client = redis.createClient();
    }

    private getRoomKey (room: string): string {
        return `rooms:${ room }:users`;
    }

}

export default new Dao();