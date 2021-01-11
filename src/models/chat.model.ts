// TODO: models here should be available to the client also

export interface IRoom {
    name: string;
    users?: IUser[];
}

export interface IUser {
    name: string;
}

export interface IMessage {
    room: string;
    username: string;
    body: string;
}