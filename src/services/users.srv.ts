export class UsersService {

    private userSocketMap: { [ key: string ]: string; } = {};
    private socketUserMap: { [ key: string ]: string; } = {};

    addUserSocketMapping (username: string, socketId: string): void {
        this.userSocketMap[ username ] = socketId;
        this.socketUserMap[ socketId ] = username;
    }

    getSocketIdByUser (username: string): string {
        return this.userSocketMap[ username ];
    }

    getUserBySocketId (socketId: string): string {
        return this.socketUserMap[ socketId ];
    }

}

export default new UsersService();