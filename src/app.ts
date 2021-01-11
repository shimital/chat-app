import express, { Express, Request, Response } from 'express';
import io, { Socket } from 'socket.io';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import chatSrv, { ChatSrv } from './services/chat.srv';
import { IMessage, IRoom } from './models/chat.model';
import usersService, { UsersService } from './services/users.srv';

class App {

    constructor (private readonly chatService: ChatSrv,
        private readonly app: Express,
        private readonly usersService: UsersService,
        private readonly ioSocket: SocketIO.Server) {
        this.mountRouts();
        this.subscribeToMessages();
        this.registerDisconnectListener();
    }

    private mountRouts (): void {
        const staticHandler: express.Handler =
            express.static(path.join(__dirname, '..', 'client', 'dist'));

        this.app.use('/', staticHandler);
        this.app.use(bodyParser.json());
        this.app.post('/users', this.createUser.bind(this));
        this.app.post('/rooms', this.createRoom.bind(this));
        this.app.get('/rooms', this.getRooms.bind(this));
        this.app.get('/rooms/:name/users', this.getUsersInRoom.bind(this));
        this.app.post('/rooms/:name/users', this.addUserToRoom.bind(this));
        this.app.delete('/rooms/:roomname/users/:username', this.removeUserFromRoom.bind(this));
        this.app.post('/rooms/:name/messages', this.addMessage.bind(this));
        this.app.use('/**', staticHandler);
    }

    private subscribeToMessages (): void {
        this.chatService.subscribe(this.incomingMessageHandler.bind(this));
    }

    private incomingMessageHandler (message: IMessage): void {
        this.ioSocket.to(message.room).emit('message', message);
    }

    private createRoom (req: Request, res: Response): void {
        const { creator, roomName }: { creator: string, roomName: string; } = req.body;

        this.chatService.createRoom(roomName, creator)
            .then((result: string) => {
                if (result) {
                    return res.json({
                        roomName: result
                    });
                }

                res.status(409).send('room already exists');
            })
            .catch((error) => {
                res.status(500).send('could not create room');
            });

        const userSocketId = this.usersService.getSocketIdByUser(creator);
        const userSocket: Socket = this.ioSocket.sockets.sockets[ userSocketId ];
        userSocket.join(roomName);
    }

    private getRooms (req: Request, res: Response): void {
        this.chatService.getRooms()
            .then((rooms: IRoom[]) => {
                res.json({ rooms });
            })
            .catch((error: Error) => {
                res.status(500).send(error.message);
            });
    }

    private getUsersInRoom (req: Request, res: Response): void {
        const roomName: string = req.params.name;

        this.chatService.getUsersInRoom(roomName)
            .then((users) => {
                res.json({ users });
            })
            .catch((error: Error) => {
                res.status(500).send(error.message);
            });
    }

    private addUserToRoom (req: Request, res: Response): void {
        const roomName: string = req.params.name;
        const username: string = req.body.username;

        this.chatService.addUserToRoom(roomName, username)
            .then((count: number) => {
                res.json({ count });
            })
            .catch((error: Error) => {
                res.status(500).send(error.message);
            });

        const userSocketId = this.usersService.getSocketIdByUser(username);
        const userSocket: Socket = this.ioSocket.sockets.sockets[ userSocketId ];

        userSocket.join(roomName, () => {
            this.ioSocket.to(roomName).emit('user-enter', { name: username });
        });
    }

    private removeUserFromRoom (req: Request, res: Response): void {
        const roomName: string = req.params.roomname;
        const username: string = req.params.username;

        this.chatService.removeUserFromRoom(roomName, username)
            .then((count: number) => {
                res.json({ count });
            })
            .catch((error: Error) => {
                res.status(500).send(error.message);
            });

        const userSocketId = this.usersService.getSocketIdByUser(username);
        const userSocket: Socket = this.ioSocket.sockets.sockets[ userSocketId ];

        userSocket.leave(roomName, () => {
            this.ioSocket.to(roomName).emit('user-leave', { name: username });
        });
    }

    private addMessage (req: Request, res: Response): void {
        const roomName: string = req.params.name;
        const username: string = req.body.username;
        const messageBody: string = req.body.body;

        this.chatService.postMessageToRoom(roomName, username, messageBody)
            .then(() => {
                res.sendStatus(200);
            });
    }

    private createUser (req: Request, res: Response): void {
        const username: string = req.body.username;
        const socketId: string = req.body.socketId;
        this.usersService.addUserSocketMapping(username, socketId);
        res.sendStatus(200);
    }

    private registerDisconnectListener (): void {
        this.ioSocket.on('connection', (socket: Socket) => {
            socket.on('disconnecting', () => {
                const username = this.usersService.getUserBySocketId(socket.id);
                const userRooms = socket.rooms;
                const nonSocketIdRoom = Object.keys(userRooms).find(key => key !== socket.id);

                if (nonSocketIdRoom) {
                    this.chatService.removeUserFromRoom(nonSocketIdRoom, username)
                        .then(() => {
                            this.ioSocket.to(nonSocketIdRoom).emit('user-leave', { name: username });
                        })
                        .catch((error: Error) => {
                            console.log('was not able to remove the disconnected user from the room');
                        });
                }
            });
        });
    }

}

const app = express();
const server = require('http').createServer(app);
const port: string | number = process.env.PORT || 3000;

new App(chatSrv, app, usersService, io(server));

server.listen(port, (err: Error) => {
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${ port }`);
});

export type ProcessedMessageNotificationHandler = (message: IMessage) => void;

